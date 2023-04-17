package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Attendance;
import project.model.AttendanceView;
import project.repository.AttendanceRepository;
import project.security.JwtAuthorizationService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RequiredArgsConstructor
@RestController("AttendanceControllerBean")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/attendance/data")
    public ResponseEntity<List<AttendanceView>> getAllRecords(@PathVariable("N") int departmentId,
                                                              @RequestParam(value = "page") String page,
                                                              @RequestParam(value = "size") String pageSize,
                                                              @RequestParam(value = "key", required = false) String keyWord,
                                                              HttpServletRequest request) {
        validateDepartmentId(departmentId);
        validatePaginationParams(page, pageSize);
        auth.authorize(request.getHeader("Authorization"),departmentId);

        List<AttendanceView> body;
        HttpHeaders headers = new HttpHeaders();
        if (keyWord == null) {
            body = attendanceRepository.getAllRecords(departmentId, Integer.valueOf(page), Integer.valueOf(pageSize));
            headers.add("attendance_count", String.valueOf(attendanceRepository.getRecordsAttendanceCount(departmentId)));
        } else {
            body = attendanceRepository.getAttendanceByKeyword(departmentId, keyWord);
            headers.add("attendance_count", String.valueOf(body.size()));
            int start = (Integer.parseInt(page) - 1) * Integer.parseInt(pageSize);
            int end = Integer.parseInt(page) * Integer.parseInt(pageSize);
            body = body.subList(Math.min(start, body.size()), Math.min(end, body.size()));
        }
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(body);
    }

    @GetMapping("/dep_{N}/attendance/")
    public AttendanceView getRecordAttendanceByStudentId(@PathVariable("N") int departmentId,
                                                         @RequestBody Attendance attendance,
                                                         HttpServletRequest request) {
        validateDepartmentId(departmentId);
        auth.authorize(request.getHeader("Authorization"),departmentId);
        return attendanceRepository.getAttendanceView(departmentId, attendance);

    }

    @PostMapping("/dep_{N}/attendance/data")
    public AttendanceView addNewRecordAttendance(@PathVariable("N") int departmentId,
                                                 @RequestBody Attendance attendance,
                                                 HttpServletRequest request) {
        validateDepartmentId(departmentId);
        auth.authorize(request.getHeader("Authorization"),departmentId);
        return attendanceRepository.addNewRecord(departmentId, attendance);
    }

    @PutMapping("/dep_{N}/attendance/data")
    public void updateRecordAttendance(@PathVariable("N") int departmentId,
                                       @RequestBody Attendance attendance,
                                       HttpServletRequest request) {
        validateDepartmentId(departmentId);
        auth.authorize(request.getHeader("Authorization"),departmentId);
        attendanceRepository.updateRecordAttendance(departmentId, attendance);
    }

    @DeleteMapping("/dep_{N}/attendance/data")
    public void deleteRecordById(@PathVariable("N") int departmentId,
                                 @RequestBody Attendance attendance,
                                 HttpServletRequest request) {
        validateDepartmentId(departmentId);
        auth.authorize(request.getHeader("Authorization"),departmentId);
        attendanceRepository.deleteRecordById(departmentId, attendance);
    }

}
