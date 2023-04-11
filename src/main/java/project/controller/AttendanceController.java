package project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Attendance;
import project.model.AttendanceView;
import project.repository.AttendanceRepository;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RestController("AttendanceControllerBean")
public class AttendanceController {

    @Autowired
    AttendanceRepository attendanceRepository;

    @GetMapping("/dep_{N}/attendance/data")
    public ResponseEntity<List<AttendanceView>> getAllRecords(@PathVariable("N") int departmentId,
                                                              @RequestParam(value = "page", required = true) String page,
                                                              @RequestParam(value = "size", required = true) String pageSize) {

        validateDepartmentId(departmentId);
        validatePaginationParams(page, pageSize);
        HttpHeaders headers = new HttpHeaders();
        headers.add("attendance_count", String.valueOf(attendanceRepository.getRecordsAttendanceCount(departmentId)));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(attendanceRepository.getAllRecords(departmentId, Integer.valueOf(page), Integer.valueOf(pageSize)));
    }

    @GetMapping("/dep_{N}/attendance/")
    public AttendanceView getRecordAttendanceByStudentId(@PathVariable("N") int departmentId, @RequestBody Attendance attendance) {
        validateDepartmentId(departmentId);
        return attendanceRepository.getAttendanceView(departmentId, attendance);
    }

    @PostMapping("/dep_{N}/attendance/data")
    public AttendanceView addNewRecordAttendance(@PathVariable("N") int departmentId, @RequestBody Attendance attendance) {
        validateDepartmentId(departmentId);
        return attendanceRepository.addNewRecord(departmentId, attendance);
    }

    @PutMapping("/dep_{N}/attendance/data")
    public void updateRecordAttendance(@PathVariable("N") int departmentId, @RequestBody Attendance attendance) {
        validateDepartmentId(departmentId);
        attendanceRepository.updateRecordAttendance(departmentId, attendance);
    }

    @DeleteMapping("/dep_{N}/attendance/data")
    public void deleteRecordById(@PathVariable("N") int departmentId, @RequestBody Attendance attendance) {
        validateDepartmentId(departmentId);
        attendanceRepository.deleteRecordById(departmentId, attendance);
    }

    @GetMapping("/dep_{N}/attendance/{key}")
    public ResponseEntity<List<AttendanceView>> getAttendanceByKeyword(@PathVariable("N") int department,
                                                                       @PathVariable String key,
                                                                       @RequestParam String page,
                                                                       @RequestParam String size) {
        validateDepartmentId(department);
        validatePaginationParams(page, size);
        HttpHeaders headers = new HttpHeaders();
        headers.add("attendance_count", String.valueOf(attendanceRepository.getRecordsAttendanceCount(department)));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(attendanceRepository.getAttendanceByKeyword(department, key, Integer.parseInt(page), Integer.parseInt(size)));
    }

}
