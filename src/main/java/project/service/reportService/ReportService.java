package project.service.reportService;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import project.model.QuarterDateModel;
import project.repository.ReportRepository;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.Supplier;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;
import static project.service.reportService.ReportRow.*;


@Service("ReportServiceBean")
@Slf4j
public class ReportService {
    private static final String REPORT_TEMPLATE_PATH = "/excelTemplate/report_template.xlsx";
    private final static int SHEET_INDEX = 0;
    private final static int LAST_CELL = 31;
    private final static short FONT_SIZE = 23;
    private final static String FONT_NAME = "Times New Roman";
    private final ReportRepository reportRepository;
    private CellStyle cellStyle;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }


    @NotNull
    public XSSFWorkbook createReport(@NotNull LocalDate dateFrom, @NotNull LocalDate dateTo) {
        log.info("Начали создание отчета");
        XSSFWorkbook xssfWorkBook = createWorkbook();
        cellStyle = applyClassicStyle(xssfWorkBook);
        XSSFSheet sheet = xssfWorkBook.getSheetAt(SHEET_INDEX);
        createLessonReportPart(sheet, dateFrom, dateTo);
        createWorkerReportPart(sheet, dateFrom, dateTo);
        createTeacherReportPart(sheet, dateFrom, dateTo);
        xssfWorkBook.getCreationHelper().createFormulaEvaluator().evaluateAll();
        log.info("Закончили создание отчета");
        return xssfWorkBook;
    }

    private XSSFWorkbook createWorkbook() {
        try (InputStream inputStream = Objects.requireNonNull(getClass().getResourceAsStream(REPORT_TEMPLATE_PATH))) {
            return new XSSFWorkbook(inputStream);
        } catch (Exception e) {
            log.error("Ошибка на этапе чтения файла:", e);
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы", e);
        }
    }


    private void createLessonReportPart(XSSFSheet sheet, LocalDate dateForm, LocalDate dateTo) {//
        setRowValues(sheet.getRow(LESSON_PLAN.getIndex()), () -> reportRepository.findAllLessonsBetweenDates(dateForm, dateTo));
        setRowValues(sheet.getRow(LESSON_HELD.getIndex()), () -> reportRepository.findAllLessonsBetweenDatesWithHeld(dateForm, dateTo));
        setRowValues(sheet.getRow(TOPIC_PLAN.getIndex()), () -> reportRepository.findAllThemesBetweenDates(dateForm, dateTo));
        setRowValues(sheet.getRow(TOPIC_HELD.getIndex()), () -> reportRepository.findAllThemesBetweenDatesWithHeld(dateForm, dateTo));
    }

    private void createWorkerReportPart(XSSFSheet sheet, LocalDate dateForm, LocalDate dateTo) {
        setRowValues(sheet.getRow(STUDENTS_PLAN.getIndex()), () -> reportRepository.findAllWorkersBetweenDates(dateForm, dateTo));
        setRowValues(sheet.getRow(STUDENTS_ALL.getIndex()), () -> reportRepository.findAllWorkersBetweenDatesWithSuccess(dateForm, dateTo));
        int rowNumber = STUDENTS_TROLL.getIndex();
        for (WorkerProfession profession : WorkerProfession.values()) {
            setRowValues(sheet.getRow(rowNumber), () -> reportRepository.findAllWorkersBetweenDatesWithSuccessAndProfession(dateForm, dateTo, profession.getProfession()));
            rowNumber++;
        }
    }

    private void createTeacherReportPart(XSSFSheet sheet, LocalDate dateForm, LocalDate dateTo) {
        setRowValues(sheet.getRow(TEACHER_PLAN.getIndex()), () -> reportRepository.findAllLessonsBetweenDates(dateForm, dateTo));
        int rowNumber = TEACHER_RUKOVOD.getIndex();
        for (TeacherProfession profession : TeacherProfession.values()) {
            setRowValues(sheet.getRow(rowNumber), () -> reportRepository.findAllTeachersByProfession(dateForm, dateTo, profession.getProfession()));
            rowNumber++;
        }
    }

    private CellStyle applyClassicStyle(XSSFWorkbook xssfWorkbook) {
        CellStyle style = xssfWorkbook.createCellStyle();
        Font font = xssfWorkbook.createFont();
        font.setFontHeightInPoints(FONT_SIZE);
        font.setFontName(FONT_NAME);
        style.setFont(font);
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setBorderBottom(CellStyle.BORDER_MEDIUM);
        style.setBottomBorderColor(IndexedColors.GREY_80_PERCENT.getIndex());
        return style;
    }

    private void setRowValues(XSSFRow row, Supplier<Integer> supplier) {
        XSSFCell cell;
        for (int column = 1; column < (LAST_CELL - 1); column += 2) {
            setCurrentDataSource("DEP_" + (column / 2 + 1));
            cell = row.getCell(column);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(supplier.get());
        }
    }

    @Deprecated
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
