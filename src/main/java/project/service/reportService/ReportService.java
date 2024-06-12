package project.service.reportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import project.model.QuarterDateModel;
import project.repository.ReportRepository;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;


@Service("ReportServiceBean")
@Slf4j
@RequiredArgsConstructor
public class ReportService {
    private static final String REPORT_TEMPLATE_PATH = "/report_template.xls";

    private final ReportRepository reportRepository;


    @NotNull
    public HSSFWorkbook createReport(int quarter, int year) {
        log.info("Начали создание отчета");
        Pair<Integer, Integer> yearMonthPair = calculateDate(quarter, year);
        HSSFWorkbook hssfWorkBook = createWorkbook();
        HSSFSheet sheet = hssfWorkBook.getSheet("Лист1");
        createLessonReportPart(sheet, yearMonthPair);
        createWorkerReportPart(sheet, yearMonthPair);
        createTeacherReportPart(sheet, yearMonthPair);
        log.info("Закончили создание отчета");
        return hssfWorkBook;
    }

    private HSSFWorkbook createWorkbook() {
        try (InputStream inputStream = Objects.requireNonNull(getClass().getResourceAsStream(REPORT_TEMPLATE_PATH))) {
            return new HSSFWorkbook(inputStream);
        } catch (Exception e) {
            log.error("Ошибка на этапе чтения файла:", e);
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы", e);
        }
    }
    private void createLessonReportPart(HSSFSheet sheet, Pair<Integer, Integer> yearMonthPair) {
        setRowValues(sheet.getRow(2), () -> reportRepository.findAllLessonsBetweenDates(yearMonthPair.getFirst(), yearMonthPair.getSecond()));
        setRowValues(sheet.getRow(3), () -> reportRepository.findAllLessonsBetweenDatesWithHeld(yearMonthPair.getFirst(), yearMonthPair.getSecond()));
        setRowValues(sheet.getRow(4), () -> reportRepository.findAllLessonsBetweenDates(yearMonthPair.getFirst(), yearMonthPair.getSecond()));
        setRowValues(sheet.getRow(5), () -> reportRepository.findAllLessonsBetweenDatesWithHeld(yearMonthPair.getFirst(), yearMonthPair.getSecond()));
    }

    private void createWorkerReportPart(HSSFSheet sheet, Pair<Integer, Integer> yearMonthPair) {
        setRowValues(sheet.getRow(6), () -> reportRepository.findAllWorkersBetweenDates(yearMonthPair.getFirst(), yearMonthPair.getSecond()));
        setRowValues(sheet.getRow(7), () -> reportRepository.findAllWorkersBetweenDatesWithSuccess(yearMonthPair.getFirst(), yearMonthPair.getSecond()));
        int rowNumber = 8;
        for (WorkerProfessions profession : WorkerProfessions.values()) {
            setRowValues(sheet.getRow(rowNumber), () -> reportRepository.findAllWorkersBetweenDatesWithSuccessAndProfession(yearMonthPair.getFirst(), yearMonthPair.getSecond(), profession.getProfession()));
            rowNumber++;
        }
        formStatsForOthersCategory(sheet.getRow(13), 7, 12, sheet);
    }

    private void createTeacherReportPart(HSSFSheet sheet, Pair<Integer, Integer> yearMonthPair) {
        setRowValues(sheet.getRow(14), () -> reportRepository.findAllLessonsBetweenDates(yearMonthPair.getFirst(), yearMonthPair.getSecond()));
        int rowNumber = 15;
        for (TeacherProfession profession : TeacherProfession.values()) {
            setRowValues(sheet.getRow(rowNumber), () -> reportRepository.findAllTeachersByProfession(yearMonthPair.getFirst(), yearMonthPair.getSecond(), profession.getProfession()));
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


    /*
     * Расчет интервала
     */
    private Pair<Integer, Integer> calculateDate(int quarter, int year) {
        int month;
        month = (quarter - 1) * 3 + 1;
        return Pair.of(year, month);
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
