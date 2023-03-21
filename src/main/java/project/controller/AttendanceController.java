package project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.exceptions.InvalidStudentIdException;
import project.model.AttendanceView;
import project.model.StudentView;
import project.repository.AttendanceRepository;

import java.util.List;

@RestController("AttendanceControllerBean")
public class AttendanceController {

    @Autowired
    AttendanceRepository attendanceRepository;

    @GetMapping("/dep_{N}/attendance/data")
    public List<AttendanceView> getAllAttendances(@PathVariable("N") int departmentId) {
        return attendanceRepository.getAllAttendances(departmentId);
    }

    @GetMapping("/dep_{N}/attendance/{id}")
    public AttendanceView getRecordAttendanceById(@PathVariable("N") int departmentId, @PathVariable String id) {
        return attendanceRepository.getRecordAttendanceById(departmentId, id);
    }

//    @PostMapping("/dep_{N}/attendance/data")
//    public void addNewRecordAttendance(@PathVariable("N") int departmentId, @RequestBody AttendanceView attendanceView) {
//        attendanceRepository.addNewRecordAttendance(departmentId , attendanceView);
//    }

    @PutMapping("/dep_{N}/attendance/data")
    public void updateRecordAttendance(@PathVariable("N") int departmentId, @RequestBody AttendanceView attendanceView) {

    }

    @DeleteMapping("/dep_{N}/attendance/{id}")
    public void deleteRecordById(@PathVariable("N") int departmentId, @PathVariable("id") String studentId) {
        attendanceRepository.deleteRecordById(departmentId, studentId);
    }

}
