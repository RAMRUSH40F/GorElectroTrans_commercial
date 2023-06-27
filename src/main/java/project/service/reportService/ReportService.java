package project.service.reportService;

import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import project.model.QuarterDateModel;
import project.repository.LessonJpaRepository;
import project.repository.ReportJpaRepository;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.IsoFields;
import java.util.*;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;
import static project.dataSource.DynamicDataSourceContextHolder.getCurrentDataSource;


@Service("ReportServiceBean")
@RequiredArgsConstructor
public class ReportService {
    private final JdbcTemplate jdbcTemplate;
    private final LessonJpaRepository lessonJpaRepository;
    private final ReportJpaRepository reportJpaRepository;

    public @NotNull HSSFWorkbook createReport(int quarter, int year) {
        final String fileName = Paths.get("src", "main", "resources", "report_template.xls").toString();
        HSSFWorkbook hssfWorkBook = readWorkbook(fileName);
        formLessonReport(hssfWorkBook, fileName, quarter, year);
        formWorkerReport(hssfWorkBook, fileName, quarter, year);
        formTeacherReport(hssfWorkBook, fileName, quarter, year);
        return hssfWorkBook;
    }

    /*
    Метод чтения файла
    */
    public HSSFWorkbook readWorkbook(String filename) {
        try {
            return new HSSFWorkbook(new POIFSFileSystem(new FileInputStream(filename)));
        } catch (IOException e) {
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы", e);
        }
    }


    /*
     * Метод записи файла
     */
    public void writeWorkbook(HSSFWorkbook workbook, String fileName) {
        try {
            FileOutputStream fileOut = new FileOutputStream(fileName);
            workbook.write(fileOut);
            fileOut.close();
        } catch (IOException e) {
            throw new RuntimeException(
                    "Произошла другая ошибка связанная с записью в таблицу", e);
        }
    }

    /*
     * Метод формирования отчетов
     */
    public void formLessonReport(HSSFWorkbook workbook, String fileName, int quarter, int year) {
        final HSSFSheet sheet = workbook.getSheet("Лист1");
       final Map<HSSFRow,Boolean> rowWithHeldMap=new HashMap<>();
        rowWithHeldMap.put(sheet.getRow(2),false);
        rowWithHeldMap.put(sheet.getRow(3),true);
        rowWithHeldMap.put(sheet.getRow(4),false);
        rowWithHeldMap.put(sheet.getRow(5),true);

        final int lastCell = 31;
        final Map.Entry<Integer, Integer> yearMonthPair = calculateDate(quarter, year);
        for (HSSFRow row : rowWithHeldMap.keySet()) {
            formLesson(row,rowWithHeldMap.get(row),lastCell,yearMonthPair);
            setResultingColumnValues(row);
        }
        writeWorkbook(workbook, fileName);
    }

    /*
     * Сбор данных о всех уроках
     */
    private void formLesson(HSSFRow row1,boolean isHeld, int lastCell, Map.Entry<Integer, Integer> yearMonthPair) {
        HSSFCell cell;
        CellStyle style = applyClassicStyle(row1.getSheet().getWorkbook());
        for (int column = 1; column < lastCell; column += 2) {
            setCurrentDataSource("DEP_" + (column / 2 + 1));
            cell = row1.getCell(column);
            Date dateFrom=new Date(yearMonthPair.getKey()-1900,yearMonthPair.getValue()-1,1);
            Date dateTo=new Date(yearMonthPair.getKey()-1900,yearMonthPair.getValue()+2,1);//?Исправить
            if(isHeld) {
                cell.setCellValue(lessonJpaRepository.findAllLessonsBetweenDates(dateFrom, dateTo));
            }else {
                cell.setCellValue(lessonJpaRepository.findAllLessonsBetweenDatesWithHeld(dateFrom, dateTo));
            }
            cell.setCellStyle(style);
        }
    }

    /*
     * Сбор данных о проведенных уроках
     */

    /*
     * Подсчет общего количества записей
     */
    private void setResultingColumnValues(HSSFRow row) {
        int total = 0;
        Cell cell;
        CellStyle style = applyClassicStyle(row.getSheet().getWorkbook());

        for (Iterator<Cell> x = row.cellIterator(); x.hasNext(); ) {
            cell = x.next();
            if (cell.getColumnIndex() == 0) {
                continue;
            }
            if (cell.getColumnIndex() == row.getLastCellNum() - 2) {
                cell.setCellStyle(style);
                cell.setCellValue(total);
            }
            total += cell.getNumericCellValue();
        }
    }

    /*
     * Формирования данных о всех работниках
     */
    public void formWorkerReport(HSSFWorkbook workbook, String filename, int quarter, int year) {
        final HSSFSheet sheet = workbook.getSheet("Лист1");
        final HSSFRow row = sheet.getRow(6);
        final Map.Entry<Integer, Integer> yearMonthPair = calculateDate(quarter, year);
        int lastCell = 31;
        formAllWorker(row, yearMonthPair, lastCell);
       /* formSuccessWorker(sheet.getRow(7), yearMonthPair, lastCell);
        formWorkerStatsByProfession(WorkerProfessions.VODITELYTR.getProfession(), sheet.getRow(8), yearMonthPair);
        formWorkerStatsByProfession(WorkerProfessions.VODITELYT.getProfession(), sheet.getRow(9), yearMonthPair);
        formWorkerStatsByProfession(WorkerProfessions.SLESARY.getProfession(), sheet.getRow(10), yearMonthPair);
        formWorkerStatsByProfession(WorkerProfessions.DISPETCHERS.getProfession(), sheet.getRow(11), yearMonthPair);
        formWorkerStatsByProfession(WorkerProfessions.SPECIALISTS.getProfession(), sheet.getRow(12), yearMonthPair);*/


        formStatsForOthersCategory(sheet.getRow(13), 7, 12, 1, row.getLastCellNum(), sheet);
        setResultingColumnValues(row);
        writeWorkbook(workbook, filename);
    }

    private void formAllWorker(HSSFRow row, Map.Entry<Integer, Integer> yearMonthPair, int lastCell) {
        HSSFCell cell;
        Date dateFrom = new Date(yearMonthPair.getKey() - 1900, yearMonthPair.getValue() - 1, 1);
        Date dateTo = new Date(yearMonthPair.getKey() - 1900, yearMonthPair.getValue() + 2, 1);
        CellStyle style = applyClassicStyle(row.getSheet().getWorkbook());
        for (int column = 1; column < lastCell - 1; column += 2) {
            setCurrentDataSource("DEP_" + (column / 2 + 1));
            System.out.println(getCurrentDataSource());
            cell = row.getCell(column);
            cell.setCellStyle(style);
            //?Исправить
            cell.setCellValue(reportJpaRepository.findAllBetweenDates(dateFrom, dateTo));
            System.out.println(getCurrentDataSource());

        }
    }

    private void formSuccessWorker(HSSFRow row, Map.Entry<Integer, Integer> yearMonthPair, int lastCell) {
        HSSFCell cell;
        Date dateFrom = new Date(yearMonthPair.getKey() - 1900, yearMonthPair.getValue() - 1, 1);
        Date dateTo = new Date(yearMonthPair.getKey() - 1900, yearMonthPair.getValue() + 2, 1);
        CellStyle style = applyClassicStyle(row.getSheet().getWorkbook());
        int dep_id=1;
        for (int column = 1; column < lastCell - 1; column += 2) {
            setCurrentDataSource("DEP_" + (column / 2 + 1));
            cell = row.getCell(column);
            cell.setCellStyle(style);
            //?Исправить
            cell.setCellValue(reportJpaRepository.findAllBetweenDateWithSuccess(dateFrom, dateTo));
        }
    }

    /*
     * Формирования данных о работниках по специальности
     */
    private void formWorkerStatsByProfession(String profession, HSSFRow row, Map.Entry<Integer, Integer> yearMonthPair) {
        if (profession == null || row == null) {
            return;
        }
        Date dateFrom = new Date(yearMonthPair.getKey() - 1900, yearMonthPair.getValue() - 1, 1);
        Date dateTo = new Date(yearMonthPair.getKey() - 1900, yearMonthPair.getValue() + 2, 1);
        final int lastCell = 31;
        HSSFCell cell;
        CellStyle style = applyClassicStyle(row.getSheet().getWorkbook());
        for (int column = 1; column < lastCell; column += 2) {
            setCurrentDataSource("DEP_" + (column / 2 + 1));
            cell = row.getCell(column);
            cell.setCellStyle(style);
            cell.setCellValue(reportJpaRepository.findAllBetweenDatesWithSubdepartment(dateFrom, dateTo, profession));
        }
        setResultingColumnValues(row);
    }

    /*
     * Формирования данных об учителях
     */
    public void formTeacherReport(HSSFWorkbook workbook, String filename, int quarter, int year) {
        final HSSFSheet sheet = workbook.getSheet("Лист1");
        final HSSFRow row1 = sheet.getRow(14);
        int lastCell = 31;
        Map.Entry<Integer, Integer> yearMonthPair = calculateDate(quarter, year);

        //formLesson(row1, lastCell, yearMonthPair);

        formTeacherStatsByProfession(TeacherProfession.RUKOVODITEL.getProfession(), sheet.getRow(15), yearMonthPair);
        formTeacherStatsByProfession(TeacherProfession.MASTER.getProfession(), sheet.getRow(16), yearMonthPair);
        formTeacherStatsByProfession(TeacherProfession.NASTAVNIK.getProfession(), sheet.getRow(17), yearMonthPair);
        formStatsForOthersCategory(sheet.getRow(18), 14, 17, 1, lastCell, sheet);
        setResultingColumnValues(row1);

        writeWorkbook(workbook, filename);
    }

    /*
     * Формирования данных об учителях определенной должности
     */
    private void formTeacherStatsByProfession(String profession, HSSFRow row, Map.Entry<Integer, Integer> yearMonthPair) {
        if (profession == null || row == null) {
            return;
        }
        int lastCell = 31;
        HSSFCell cell;
        CellStyle style = applyClassicStyle(row.getSheet().getWorkbook());
        for (int column = 1; column < lastCell; column += 2) {
            setCurrentDataSource("DEP_" + (column / 2 + 1));
            cell = row.getCell(column);
            cell.setCellStyle(style);
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM "
                            + "lesson WHERE `date` BETWEEN '"
                            + yearMonthPair.getKey() + "-"
                            + yearMonthPair.getValue()
                            + "-01' AND '"
                            + yearMonthPair.getKey() + "-"
                            + (yearMonthPair.getValue() + 3)
                            + "-01' AND teacherPost LIKE '"
                            + profession + "'",
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
        setResultingColumnValues(row);
    }

    /*
     * Формирования данных о специальностях, которые не попали в перечень в шаблоне
     */
    public void formStatsForOthersCategory(HSSFRow destination, int from, int to, int firstCell, int lastCell, HSSFSheet sheet) {
        int value;
        HSSFRow row;
        Cell cell;
        CellStyle style = applyClassicStyle(destination.getSheet().getWorkbook());
        int result;
        for (int cellIndex = firstCell; cellIndex < lastCell; cellIndex += 2) {
            value = 0;
            for (int rowIndex = from + 1; rowIndex <= to; rowIndex++) {
                row = sheet.getRow(rowIndex);
                value += row.getCell(cellIndex).getNumericCellValue();
            }
            result = (int) sheet.getRow(from).getCell(cellIndex).getNumericCellValue() - value;
            cell = destination.getCell(cellIndex);
            cell.setCellStyle(style);
            cell.setCellValue(result);
        }
        setResultingColumnValues(destination);
    }

    /*
     * Расчет интервала
     */
    private Map.Entry<Integer, Integer> calculateDate(int quarter, int year) {
        int month;
        month = (quarter - 1) * 3 + 1;
        return new AbstractMap.SimpleImmutableEntry<>(year, month);
    }

    /*
     * Формирование стиля
     */
    private CellStyle applyClassicStyle(HSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        // Настройки фона и шрифта
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 23);
        font.setFontName("Times New Roman");
        style.setFont(font);
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setBorderBottom(CellStyle.BORDER_THIN);
        return style;
    }

    @NotNull
    public List<QuarterDateModel> getQuarterDateModelList() {
        int year = Year.now().getValue();
        int quarter = LocalDate.now().get(IsoFields.QUARTER_OF_YEAR);
        List<QuarterDateModel> intervals = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            intervals.add(new QuarterDateModel(year, quarter));
            quarter--;
            if (quarter <= 0) {
                quarter = 4;
                year--;
            }
        }
        return intervals;
    }
}
