package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Attendance;
import project.model.AttendanceView;
import project.security.model.MyToken;
import project.security.model.User;
import project.repository.AttendanceRepository;
import project.security.JwtAuthorizationService;

import java.util.List;

import static project.exceptions.Validator.*;

@RequiredArgsConstructor
@RestController("AttendanceControllerBean")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/attendance/data")
    public ResponseEntity<List<AttendanceView>> getAllRecords(@PathVariable("N") int departmentId,
                                                              @RequestParam(value = "page") String page,
                                                              @RequestParam(value = "size") String pageSize,
                                                              @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        validatePaginationParams(page, pageSize);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("attendance_count", String.valueOf(attendanceRepository.getRecordsAttendanceCount(departmentId)));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(attendanceRepository.getAllRecords(departmentId, Integer.valueOf(page), Integer.valueOf(pageSize)));
    }

    @GetMapping("/dep_{N}/attendance/")
    public AttendanceView getRecordAttendanceByStudentId(@PathVariable("N") int departmentId,
                                                         @RequestBody Attendance attendance,
                                                         @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        return attendanceRepository.getAttendenceView(departmentId, attendance);
    }

    @PostMapping("/dep_{N}/attendance/data")
    public AttendanceView addNewRecordAttendance(@PathVariable("N") int departmentId,
                                                 @RequestBody Attendance attendance,
                                                 @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        return attendanceRepository.addNewRecord(departmentId, attendance);
    }

    @PutMapping("/dep_{N}/attendance/data")
    public void updateRecordAttendance(@PathVariable("N") int departmentId,
                                       @RequestBody Attendance attendance,
                                       @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        attendanceRepository.updateRecordAttendance(departmentId, attendance);
    }

    @DeleteMapping("/dep_{N}/attendance/data")
    public void deleteRecordById(@PathVariable("N") int departmentId,
                                 @RequestBody Attendance attendance,
                                 @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        attendanceRepository.deleteRecordById(departmentId, attendance);
    }

}
