package project.service.reportService;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
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

import javax.persistence.criteria.CriteriaBuilder;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.function.Supplier;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;


@Service("ReportServiceBean")
@Slf4j
public class ReportService {
    private static final String REPORT_TEMPLATE_PATH = "/report_template.xlsx";
    private final static int SHEET_INDEX = 0;
    private final ReportRepository reportRepository;
    private CellStyle cellStyle;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }


    @NotNull
    public ByteArrayOutputStream createReport(LocalDate dateFrom, LocalDate dateTo) {
        log.info("Начали создание отчета");
        XSSFWorkbook xssfWorkBook = createWorkbook();
        cellStyle = applyClassicStyle(xssfWorkBook);
        XSSFSheet sheet = xssfWorkBook.getSheetAt(SHEET_INDEX);
        createLessonReportPart(sheet, dateFrom, dateTo);
        createWorkerReportPart(sheet, dateFrom, dateTo);
        createTeacherReportPart(sheet, dateFrom, dateTo);
        log.info("Закончили создание отчета");
        return convertWorkbookToByteArray(xssfWorkBook);
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

    private ByteArrayOutputStream convertWorkbookToByteArray(XSSFWorkbook workbook) {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
            workbook.write(byteArrayOutputStream);
            return byteArrayOutputStream;
        } catch (IOException e) {
            log.info("Ошибка при конвертации отчета в массив байтов");
            throw new RuntimeException(e);
        }
    }

    /**
     * Списко изменений: поменять yearMounthPair на LocalDate
     * 1) Так же будет приходить Пара дат, для этого можно создать отдельный класс
     * 2) Убрать лямды, сразу пероедавать значение - лямды лишние
     *
     * @param sheet
     * @param yearMonthPair
     */
    private void createLessonReportPart(XSSFSheet sheet, LocalDate dateForm, LocalDate dateTo) {//
        setRowValues(sheet.getRow(2), ()->reportRepository.findAllLessonsBetweenDates(dateForm, dateTo));
        setRowValues(sheet.getRow(3), ()->reportRepository.findAllLessonsBetweenDatesWithHeld(dateForm, dateTo));
        setRowValues(sheet.getRow(4), ()->reportRepository.findAllLessonsBetweenDates(dateForm, dateTo));
        setRowValues(sheet.getRow(5), ()->reportRepository.findAllLessonsBetweenDatesWithHeld(dateForm, dateTo));
    }

    private void createWorkerReportPart(XSSFSheet sheet, LocalDate dateForm, LocalDate dateTo) {
        setRowValues(sheet.getRow(6), ()->reportRepository.findAllWorkersBetweenDates(dateForm, dateTo));
        setRowValues(sheet.getRow(7), ()->reportRepository.findAllWorkersBetweenDatesWithSuccess(dateForm, dateTo));
        int rowNumber = 8;// тут что-то не тако
        for (WorkerProfessions profession : WorkerProfessions.values()) {
            setRowValues(sheet.getRow(rowNumber), ()->reportRepository.findAllWorkersBetweenDatesWithSuccessAndProfession(dateForm, dateTo, profession.getProfession()));
            rowNumber++;
        }
        formStatsForOthersCategory(sheet.getRow(13), 7, 12, sheet);
    }

    private void createTeacherReportPart(XSSFSheet sheet, LocalDate dateForm, LocalDate dateTo) {
        setRowValues(sheet.getRow(14), ()->reportRepository.findAllLessonsBetweenDates(dateForm, dateTo));
        int rowNumber = 15;
        for (TeacherProfession profession : TeacherProfession.values()) {
            setRowValues(sheet.getRow(rowNumber), ()->reportRepository.findAllTeachersByProfession(dateForm, dateTo, profession.getProfession()));
            rowNumber++;
        }
        formStatsForOthersCategory(sheet.getRow(18), 14, 17, sheet);
    }

    //Попробовать заменить на функцию в exel, либо просто создать запрос в бд соотвесвующий,
// логика на стороне сервиса - излишняя
    private void formStatsForOthersCategory(XSSFRow destination, int from, int to, XSSFSheet sheet) {
        int value;
        int firstCell = 1;
        int lastCell = 31;
        XSSFRow row;
        Cell cell;
        int result;
        for (int cellIndex = firstCell; cellIndex < lastCell; cellIndex += 2) {
            value = 0;
            for (int rowIndex = from + 1; rowIndex <= to; rowIndex++) {
                row = sheet.getRow(rowIndex);
                value += row.getCell(cellIndex).getNumericCellValue();
            }
            result = (int) sheet.getRow(from).getCell(cellIndex).getNumericCellValue() - value;
            cell = destination.getCell(cellIndex);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(result);
        }
        setResultingRowValues(destination);
    }

    //Уже будет не нужно
    /*
     * Расчет интервала
     */


    /*
     * Формирование стиля
     */
    //Вынести стиль в класс, применять один раз
    private CellStyle applyClassicStyle(XSSFWorkbook workbook) {
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

    //Будет не нужно
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

    //Убрать все магически числа
    //Красивее сделать переключение между датасорсами
    private void setRowValues(XSSFRow row, Supplier<Integer> supplier) {
        XSSFCell cell;
        int lastCell = 31;
        for (int column = 1; column < lastCell - 1; column += 2) {
            setCurrentDataSource("DEP_" + (column / 2 + 1));
            cell = row.getCell(column);
            cell.setCellStyle(cellStyle);
            cell.setCellValue(supplier.get());
        }
        //setResultingRowValues(row);
    }

    //Попробовать заменить на exel функцию
    private void setResultingRowValues(XSSFRow row) {
        int total = 0;
        Cell cell;

        for (Iterator<Cell> x = row.cellIterator(); x.hasNext(); ) {
            cell = x.next();
            if (cell.getColumnIndex() == 0) {
                continue;
            }
            if (cell.getColumnIndex() == row.getLastCellNum() - 2) {
                cell.setCellStyle(cellStyle);
                cell.setCellValue(total);
            }
            total += cell.getNumericCellValue();
        }
    }
}
