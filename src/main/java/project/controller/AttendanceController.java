package project.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNullApi;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;
import project.model.Attendance;
import project.service.AttendanceServiceImpl;

import java.util.List;
import java.util.Optional;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RequiredArgsConstructor
@RestController
public class AttendanceController {

    private final AttendanceServiceImpl attendanceService;

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

}
