package project.service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import project.model.Attendance;
import project.repository.AttendanceJpaRepository;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceReportServiceImpl {
    private static final String ATTENDANCE_REPORT_TEMPLATE_PATH = "/excelTemplate/attendance_report_template.xlsx";
    private final AttendanceJpaRepository attendanceJpaRepository;
    private CellStyle style;

    @NonNull
    public XSSFWorkbook attendanceReport(Integer departmentId, LocalDate dateFrom, LocalDate dateTo){
        setCurrentDataSource("DEP_" + departmentId);
        log.info("Начало создания выгрузки");
        XSSFWorkbook workbook = createWorkbook();
        XSSFSheet sheet = workbook.getSheetAt(0);
        style = makeCellStyle(workbook);
        setAttendanceData(sheet,dateFrom,dateTo);
        log.info("Конец создания выгрузки");
        return workbook;
    }
    private XSSFWorkbook createWorkbook() {
        try (InputStream inputStream = Objects.requireNonNull(getClass().getResourceAsStream(ATTENDANCE_REPORT_TEMPLATE_PATH))) {
            XSSFWorkbook wb = new XSSFWorkbook(inputStream);
            return wb;
        } catch (Exception e) {
            log.error("Ошибка на этапе чтения файла:", e);
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы", e);
        }
    }
    private void setAttendanceData(XSSFSheet sheet,LocalDate dateFrom,LocalDate dateTo){
        List<Attendance> attendances = attendanceJpaRepository.findAttendancesBetweenDate(dateFrom,dateTo);

        for (int i=1;i<attendances.size();i++) {
            XSSFRow row = sheet.createRow(i);
            setDataToRow(row, attendances.get(i));
        }
    }
    private void setDataToRow(XSSFRow row,Attendance attendance){
        setStyle(row);

        row.getCell(0).setCellValue(attendance.getLessonId());
        row.getCell(1).setCellValue(attendance.getStudentName());
        row.getCell(2).setCellValue(attendance.getLessonDate().toString());
        row.getCell(3).setCellValue(String.format( "%.1f",attendance.getLessonDuration()));
        row.getCell(4).setCellValue(attendance.getSuccess()==1?"Зачет":"Незачет");
        row.getCell(5).setCellValue(attendance.getLessonTopic());
        row.getCell(6).setCellValue(attendance.getSubdepartmentName());
        row.getCell(7).setCellValue(attendance.getLessonTeacher());
    }

    private void setStyle(XSSFRow row){
        XSSFCell cell;

        for (int i=0;i<8;i++) {
            cell= row.createCell(i);
            cell.setCellStyle(style);
        }
    }

    private CellStyle makeCellStyle(XSSFWorkbook workbook){
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setBottomBorderColor(IndexedColors.BLACK.index);
        style.setBorderTop(CellStyle.BORDER_THIN);
        style.setTopBorderColor(IndexedColors.BLACK.index);
        style.setBorderLeft(CellStyle.BORDER_THIN);
        style.setLeftBorderColor(IndexedColors.BLACK.index);
        style.setBorderRight(CellStyle.BORDER_THIN);
        style.setRightBorderColor(IndexedColors.BLACK.index);
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(CellStyle.ALIGN_CENTER);
        style.setWrapText(true);
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 12);
        font.setFontName("Times New Roman");
        style.setFont(font);
        return style;
    }
}
