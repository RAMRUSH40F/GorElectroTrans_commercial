package project.service.reportService;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import project.model.QuarterDateModel;
import project.repository.ReportRepository;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.nio.file.FileSystemNotFoundException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.IsoFields;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;


@Service("ReportServiceBean")
@Slf4j
public class ReportService {
    private static final Pattern ARCHIVE_PATTERN = Pattern.compile("(.*)\\.(([wj])ar!)(.*)");
    private static final String REPORT_TEMPLATE_PATH = "/report_template.xls";
    private final ReportRepository reportRepository;
    private final File tempFile;
    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
        try {
            this.tempFile = File.createTempFile("temp_report", "xls");
            tempFile.deleteOnExit();
        } catch (IOException e) {
            log.error("Произошла ошибка при попытке создания временного файла отчетов",e);
            throw new RuntimeException(e);
        }
    }
    @NotNull
    public HSSFWorkbook createReport(int quarter, int year) {
        log.info("Начали создание отчета");
        Map.Entry<Integer, Integer> yearMonthPair = calculateDate(quarter, year);
        HSSFWorkbook hssfWorkBook = createWorkbook();
        HSSFSheet sheet = hssfWorkBook.getSheet("Лист1");
        createLessonReportPart(sheet, yearMonthPair);
        createWorkerReportPart(sheet, yearMonthPair);
        createTeacherReportPart(sheet, yearMonthPair);
        writeToWorkbook(hssfWorkBook);
        log.info("Закончили создание отчета");
        return hssfWorkBook;
    }

    /*
    Метод чтения файла
    */
    private HSSFWorkbook createWorkbook() {
        URL templateClasspath=Objects.requireNonNull(getClass().getResource(REPORT_TEMPLATE_PATH));

        boolean workingInJarFile = ARCHIVE_PATTERN.matcher(templateClasspath.toString()).matches();
        if(workingInJarFile){
            log.info("Создаем систему файлов для архива");
            try {
                initFileSystem(templateClasspath.toURI());
            } catch (Exception e) {
                log.error("Ошибка создания системы файлов",e);
                throw new RuntimeException(e);
            }
       }
        try(FileOutputStream out = new FileOutputStream(tempFile)) {
            log.debug("Путь к шаблон до преобразования к объекту Path : {}", templateClasspath.toURI());
            Path templatePath = Paths.get(URI.create(templateClasspath.toString().replace("classes!/", "classes/")));//Почему-то в докере ставится лишний восклицательный знак
            log.debug("Путь к шаблон после преобразования к объекту  Path : {}", templatePath);
            Files.copy(templatePath, out);
            return new HSSFWorkbook(new POIFSFileSystem(new FileInputStream(tempFile)));
        } catch (Exception e) {
            log.error("Ошибка на этапе чтения файла:", e);
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы", e);
        }
    }


    /*
     * Метод записи файла
     */
    private void writeToWorkbook(HSSFWorkbook workbook) {
        try(FileOutputStream fileOut = new FileOutputStream(tempFile)) {
            workbook.write(fileOut);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Произошла ошибка при записи данных в таблицу", e);
        }
    }

    private void createLessonReportPart(HSSFSheet sheet, Map.Entry<Integer, Integer> yearMonthPair) {
        setRowValues(sheet.getRow(2), () -> reportRepository.findAllLessonsBetweenDates(yearMonthPair.getKey(), yearMonthPair.getValue()));
        setRowValues(sheet.getRow(3), () -> reportRepository.findAllLessonsBetweenDatesWithHeld(yearMonthPair.getKey(), yearMonthPair.getValue()));
        setRowValues(sheet.getRow(4), () -> reportRepository.findAllLessonsBetweenDates(yearMonthPair.getKey(), yearMonthPair.getValue()));
        setRowValues(sheet.getRow(5), () -> reportRepository.findAllLessonsBetweenDatesWithHeld(yearMonthPair.getKey(), yearMonthPair.getValue()));
    }

    private void createWorkerReportPart(HSSFSheet sheet, Map.Entry<Integer, Integer> yearMonthPair) {
        setRowValues(sheet.getRow(6), () -> reportRepository.findAllWorkersBetweenDates(yearMonthPair.getKey(), yearMonthPair.getValue()));
        setRowValues(sheet.getRow(7), () -> reportRepository.findAllWorkersBetweenDatesWithSuccess(yearMonthPair.getKey(), yearMonthPair.getValue()));
        int rowNumber = 8;
        for (WorkerProfessions profession : WorkerProfessions.values()) {
            setRowValues(sheet.getRow(rowNumber), () -> reportRepository.findAllWorkersBetweenDatesWithSuccessAndProfession(yearMonthPair.getKey(), yearMonthPair.getValue(), profession.getProfession()));
            rowNumber++;
        }
        formStatsForOthersCategory(sheet.getRow(13), 7, 12, sheet);
    }

    private void createTeacherReportPart(HSSFSheet sheet, Map.Entry<Integer, Integer> yearMonthPair) {
        setRowValues(sheet.getRow(14), () -> reportRepository.findAllLessonsBetweenDates(yearMonthPair.getKey(), yearMonthPair.getValue()));
        int rowNumber = 15;
        for (TeacherProfession profession : TeacherProfession.values()) {
            setRowValues(sheet.getRow(rowNumber), () -> reportRepository.findAllTeachersByProfession(yearMonthPair.getKey(), yearMonthPair.getValue(), profession.getProfession()));
            rowNumber++;
        }
        formStatsForOthersCategory(sheet.getRow(18), 14, 17, sheet);
    }

    private void formStatsForOthersCategory(HSSFRow destination, int from, int to, HSSFSheet sheet) {
        int value;
        int firstCell = 1;
        int lastCell = 31;
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
        setResultingRowValues(destination);
    }
    private void initFileSystem(URI uri) throws IOException
    {
        try
        {
             FileSystems.getFileSystem(uri);
        }
        catch( FileSystemNotFoundException e )
        {
            Map<String, String> env = new HashMap<>();
            env.put("create", "true");
            FileSystems.newFileSystem(uri, env);
        }
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
        style.setBorderBottom(CellStyle.BORDER_MEDIUM);
        style.setBottomBorderColor(IndexedColors.GREY_80_PERCENT.getIndex());
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

    private void setRowValues(HSSFRow row, StatisticFormator statisticFormator) {
        HSSFCell cell;
        int lastCell = 31;
        CellStyle style = applyClassicStyle(row.getSheet().getWorkbook());
        for (int column = 1; column < lastCell - 1; column += 2) {
            setCurrentDataSource("DEP_" + (column / 2 + 1));
            cell = row.getCell(column);
            cell.setCellStyle(style);
            cell.setCellValue(statisticFormator.formStatistic());
        }
        setResultingRowValues(row);
    }

    private void setResultingRowValues(HSSFRow row) {
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
}
