package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Attendance;
import project.service.AttendanceService;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RequiredArgsConstructor
@RestController("AttendanceControllerBean")
public class AttendanceController {

    private final AttendanceService attendanceService;

    // Todo : refactor lots of logic here. Pagination must be in logic
    @GetMapping("/dep_{N}/attendance/data")
    public ResponseEntity<List<Attendance>> getAllRecords(@PathVariable("N") String depId,
                                                          @RequestParam(value = "page") String page,
                                                          @RequestParam(value = "size") String pageSize,
                                                          @RequestParam(value = "key", required = false) String keyWord,
                                                          @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validatePaginationParams(page, pageSize);
        List<Attendance> body;
        HttpHeaders headers = new HttpHeaders();
        if (keyWord == null) {
            body = attendanceService.findAllPaginated(departmentId, Integer.valueOf(page), Integer.valueOf(pageSize));
            headers.add("attendance_count", String.valueOf(attendanceService.getCount(departmentId)));
        } else {
            body = attendanceService.getByKeyword(departmentId, keyWord);
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
