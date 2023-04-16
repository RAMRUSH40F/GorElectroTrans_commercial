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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Year;
import java.util.AbstractMap;
import java.util.Iterator;
import java.util.Map;

@Service("ReportServiceBean")
@RequiredArgsConstructor
public class ReportService {
    private final JdbcTemplate jdbcTemplate;

    /**
     * Главный метод
     */
    public void formLessonReport(HSSFWorkbook workbook, String fileName, int quarter) {
        final HSSFSheet sheet = workbook.getSheet("Лист1");
        final HSSFRow row1 = sheet.getRow(2);
        final HSSFRow row2 = sheet.getRow(3);
        final HSSFRow row3 = sheet.getRow(4);
        final HSSFRow row4 = sheet.getRow(5);
        final int lastCell = 31;
        final Map.Entry<Integer, Integer> yearMonthPair = calculateDate(quarter);

        formLesson(row1, lastCell, yearMonthPair);
        formHeldLesson(row2, lastCell, yearMonthPair);
        formLesson(row3, lastCell, yearMonthPair);
        formHeldLesson(row4, lastCell, yearMonthPair);

        setResultingColumnValues(row1);
        setResultingColumnValues(row2);
        setResultingColumnValues(row3);
        setResultingColumnValues(row4);
        writeWorkbook(workbook, fileName);
    }


    public HSSFWorkbook readWorkbook(String filename) {
        try(InputStream inputStream = getClass().getResourceAsStream(filename)) {
            return new HSSFWorkbook(new POIFSFileSystem(inputStream));
        } catch (IOException e) {
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы", e);
        }
    }

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


    private void formLesson(HSSFRow row1, int lastCell, Map.Entry<Integer, Integer> yearMonthPair) {
        HSSFCell cell;
        CellStyle style = applyClassicStyleToWorkbook(row1.getSheet().getWorkbook());
        for (int column = 1; column < lastCell; column += 2) {
            cell = row1.getCell(column);
            cell.setCellStyle(style);
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (column / 2 + 1)
                            + ".lesson WHERE `date` BETWEEN '"
                            + yearMonthPair.getKey() + "-"
                            + yearMonthPair.getValue()
                            + "-01' AND '"
                            + yearMonthPair.getKey() + "-"
                            + (yearMonthPair.getValue() + 3) + "-01'",
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
    }

    private void formHeldLesson(HSSFRow row, int lastCell, Map.Entry<Integer, Integer> yearMonthPair) {
        HSSFCell cell;
        CellStyle style = applyClassicStyleToWorkbook(row.getSheet().getWorkbook());

        for (int column = 1; column < lastCell - 1; column += 2) {
            cell = row.getCell(column);
            cell.setCellStyle(style);
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_"
                            + (column / 2 + 1)
                            + ".lesson WHERE `date` BETWEEN '"
                            + yearMonthPair.getKey() + "-0"
                            + yearMonthPair.getValue()
                            + "-01' AND '"
                            + yearMonthPair.getKey() + "-0"
                            + (yearMonthPair.getValue() + 3)
                            + "-01' AND isHeld=true",
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
    }

    private void setResultingColumnValues(HSSFRow row) {
        int total = 0;
        Cell cell;
        CellStyle style = applyClassicStyleToWorkbook(row.getSheet().getWorkbook());

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


    public void formWorkerReport(HSSFWorkbook workbook, String filename) {
        final HSSFSheet sheet = workbook.getSheet("Лист1");
        final HSSFRow row = sheet.getRow(7);
        HSSFCell cell;
        CellStyle style = applyClassicStyleToWorkbook(row.getSheet().getWorkbook());
        int lastCell = 31;
        for (int column = 1; column < lastCell - 1; column += 2) {
            cell = row.getCell(column);
            cell.setCellStyle(style);
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (column / 2 + 1) + ".student",
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
        formWorkerStatsByProfession(WorkerProfessions.VODITELY.getProfession(), sheet.getRow(8));
        formWorkerStatsByProfession(WorkerProfessions.SLESARY.getProfession(), sheet.getRow(9));
        formWorkerStatsByProfession(WorkerProfessions.DISPETCHERS.getProfession(), sheet.getRow(10));
        formWorkerStatsByProfession(WorkerProfessions.SPECIALISTS.getProfession(), sheet.getRow(11));


        formTeacherStatsForOthersCategory(sheet.getRow(12), 7, 11, 1, row.getLastCellNum(), sheet);
        setResultingColumnValues(row);
        writeWorkbook(workbook, filename);
    }

    private void formWorkerStatsByProfession(String profession, HSSFRow row) {
        if (profession == null || row == null) {
            return;
        }
        final int lastCell = 31;
        int professionId;
        HSSFCell cell;
        CellStyle style = applyClassicStyleToWorkbook(row.getSheet().getWorkbook());
        for (int column = 1; column < lastCell; column += 2) {
            cell = row.getCell(column);
            cell.setCellStyle(style);
            try {
                professionId = jdbcTemplate.query("SELECT id FROM DEP_"
                                + (column / 2 + 1)
                                + ".subdepartment WHERE name LIKE '"
                                + profession + "'",
                        (rs, rowNum) -> rs.getInt("id")).get(0);
            } catch (IndexOutOfBoundsException e) {
                professionId = 0;
            }
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_"
                            + (column / 2 + 1)
                            + ".student WHERE subdepartment_id="
                            + professionId,
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
        setResultingColumnValues(row);
    }

    public void formTeacherReport(HSSFWorkbook workbook, String filename, int quarter) {
        final HSSFSheet sheet = workbook.getSheet("Лист1");
        final HSSFRow row1 = sheet.getRow(13);
        int lastCell = 31;
        Map.Entry<Integer, Integer> yearMonthPair = calculateDate(quarter);

        formLesson(row1, lastCell, yearMonthPair);

        formTeacherStatsByProfession(TeacherProfession.RUKOVODITEL.getProfession(), sheet.getRow(14), quarter);
        formTeacherStatsByProfession(TeacherProfession.MASTER.getProfession(), sheet.getRow(15), quarter);
        formTeacherStatsByProfession(TeacherProfession.NASTAVNIK.getProfession(), sheet.getRow(16), quarter);
        formTeacherStatsForOthersCategory(sheet.getRow(17), 13, 16, 1, lastCell, sheet);
        setResultingColumnValues(row1);

        writeWorkbook(workbook, filename);
    }


    private void formTeacherStatsByProfession(String profession, HSSFRow row, int quarter) {
        if (profession == null || row == null) {
            return;
        }
        Map.Entry<Integer, Integer> yearMonthPair = calculateDate(quarter);
        int lastCell = 31;
        HSSFCell cell;
        CellStyle style = applyClassicStyleToWorkbook(row.getSheet().getWorkbook());
        for (int column = 1; column < lastCell; column += 2) {
            cell = row.getCell(column);
            cell.setCellStyle(style);
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (column / 2 + 1)
                            + ".lesson WHERE `date` BETWEEN '"
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

    public void formTeacherStatsForOthersCategory(HSSFRow destination, int from, int to, int firstCell, int lastCell, HSSFSheet sheet) {
        int value;
        HSSFRow row;
        Cell cell;
        CellStyle style = applyClassicStyleToWorkbook(destination.getSheet().getWorkbook());
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

    private Map.Entry<Integer, Integer> calculateDate(int quarter) {
        int month;
        int year;
        if (quarter == 4) {
            year = Year.now().getValue() + 1;
            month = 1;
        } else {
            year = Year.now().getValue();
            month = (quarter - 1) * 3 + 1;
        }
        return new AbstractMap.SimpleImmutableEntry<>(year, month);
    }

    private CellStyle applyClassicStyleToWorkbook(HSSFWorkbook workbook) {
        CellStyle style = workbook.createCellStyle();
        // Настройки фона и шрифта
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 20);
        font.setFontName("Times New Roman");
        style.setFont(font);
        return style;
    }
}
