package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Attendance;
import project.service.AttendanceServiceImpl;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RequiredArgsConstructor
@RestController
public class AttendanceController {

    private final AttendanceServiceImpl attendanceService;

    @GetMapping("/dep_{N}/attendance/data")
    public ResponseEntity<List<Attendance>> findAllByKeyWordWithPagination(@PathVariable("N") String depId,
                                                                           @RequestParam(value = "page") String page,
                                                                           @RequestParam(value = "size") String pageSize,
                                                                           @RequestParam(value = "key", required = false) String keyWord,
                                                                           @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validatePaginationParams(page, pageSize);

        Page<Attendance> attendancePage = attendanceService.findAllByKeywordWithPagination(departmentId, keyWord, Integer.valueOf(page), Integer.valueOf(pageSize));
        HttpHeaders headers = new HttpHeaders();
        headers.add("attendance_count", String.valueOf(attendancePage.getTotalElements()));

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(attendancePage.getContent());
    }


    @PostMapping("/dep_{N}/attendance/data")
    public Attendance addNewRecordAttendance(@PathVariable("N") String depId,
                                             @RequestBody Attendance attendance,
                                             @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        return attendanceService.save(departmentId, attendance);
    }

    @PutMapping("/dep_{N}/attendance/data")
    public void updateRecordAttendance(@PathVariable("N") String depId,
                                       @RequestBody Attendance attendance,
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        attendanceService.updateEntity(departmentId, attendance);
    }

    @DeleteMapping("/dep_{N}/attendance/data")
    public void deleteRecordById(@PathVariable("N") String depId,
                                 @RequestBody Attendance attendance,
                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        attendanceService.deleteById(departmentId, attendance);
    }

}
