package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Attendance;
import project.model.AttendanceView;
import project.repository.AttendanceRepository;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RequiredArgsConstructor
@RestController("AttendanceControllerBean")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;

    @GetMapping("/dep_{N}/attendance/data")
    public ResponseEntity<List<AttendanceView>> getAllRecords(@PathVariable("N") String depId,
                                                              @RequestParam(value = "page") String page,
                                                              @RequestParam(value = "size") String pageSize,
                                                              @RequestParam(value = "key", required = false) String keyWord,
                                                              @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validatePaginationParams(page, pageSize);


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
    public AttendanceView getRecordAttendanceByStudentId(@PathVariable("N") String depId,
                                                         @RequestBody Attendance attendance,
                                                         @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);

        return attendanceRepository.getAttendanceView(departmentId, attendance);

    }

    @PostMapping("/dep_{N}/attendance/data")
    public AttendanceView addNewRecordAttendance(@PathVariable("N") String depId,
                                                 @RequestBody Attendance attendance,
                                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);

        return attendanceRepository.addNewRecord(departmentId, attendance);
    }

    @PutMapping("/dep_{N}/attendance/data")
    public void updateRecordAttendance(@PathVariable("N") String depId,
                                       @RequestBody Attendance attendance,
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);

        attendanceRepository.updateRecordAttendance(departmentId, attendance);
    }

    @DeleteMapping("/dep_{N}/attendance/data")
    public void deleteRecordById(@PathVariable("N") String depId,
                                 @RequestBody Attendance attendance,
                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);

        attendanceRepository.deleteRecordById(departmentId, attendance);
    }

}
