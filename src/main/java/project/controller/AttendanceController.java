package project.controller;


import lombok.RequiredArgsConstructor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Attendance;
import project.service.AttendanceReportServiceImpl;
import project.service.AttendanceServiceImpl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static project.exceptions.Validator.validateDate;
import static project.exceptions.Validator.validateDepartmentId;

@RequiredArgsConstructor
@RestController
public class AttendanceController {

    private final AttendanceServiceImpl attendanceService;
    private final AttendanceReportServiceImpl attendanceReportService;

    @GetMapping("/dep_{N}/attendance/data")
    public ResponseEntity<List<Attendance>> findAllByKeyWordWithPagination(@PathVariable("N") String depId,
                                                                           Pageable paginationParams,
                                                                           Optional<String> key,
                                                                           @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        Page<Attendance> attendancePage = attendanceService.findAllByKeywordWithPagination(departmentId, key, paginationParams);
        HttpHeaders headers = new HttpHeaders();
        headers.add("attendance_count", String.valueOf(attendancePage.getTotalElements()));

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(attendancePage.getContent());
    }


    @PostMapping("/dep_{N}/attendance/data")
    public Attendance createAttendance(@PathVariable("N") String depId,
                                       @RequestBody Attendance attendance,
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        return attendanceService.save(departmentId, attendance);
    }

    @PutMapping("/dep_{N}/attendance/data")
    public Attendance updateAttendance(@PathVariable("N") String depId,
                                       @RequestBody Attendance attendance,
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        return attendanceService.updateEntity(departmentId, attendance);
    }

    @DeleteMapping("/dep_{N}/attendance/data")
    public void deleteById(@PathVariable("N") String depId,
                           @RequestBody Attendance attendance,
                           @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        attendanceService.deleteById(departmentId, attendance);
    }

    @GetMapping("/dep_{N}/report/attendance")
    public ResponseEntity<ByteArrayResource> createAttendanceReport(@PathVariable("N") String depId,
                                                                    @RequestParam("dateFrom") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateFrom,
                                                                    @RequestParam("dateTo") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateTo,
                                                                    @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken){
        Integer departmentId = validateDepartmentId(depId);
        validateDate(dateFrom,dateTo);

        XSSFWorkbook attendanceReportFile = attendanceReportService.attendanceReport(departmentId,dateFrom,dateTo);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            attendanceReportFile.write(outputStream);
        }catch (IOException exception){
            throw new RuntimeException("Ошибка записи файла в поток байт");
        }

        byte[] bytes = outputStream.toByteArray();

        // Set response headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "Посещаемость_" + dateFrom + "_до_" + dateTo + "_Отдел_" +departmentId+ ".xlsx");

        // Return ResponseEntity with file data and headers
        return ResponseEntity.ok()
                .headers(headers)
                .body(new ByteArrayResource(bytes));
    }

}
