package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.StudentView;
import project.repository.StudentRepository;

import java.util.List;

import static project.exceptions.Validator.*;

@RestController
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping("/dep_{N}/students/data")
    public ResponseEntity<List<StudentView>> getStudentPage(@PathVariable("N") int departmentId,
                                                            @RequestParam(value = "page", required = true) String page,
                                                            @RequestParam(value = "size", required = true) String pageSize) {

        validateDepartmentId(departmentId);
        validatePaginationParams(page, pageSize);
        HttpHeaders headers = new HttpHeaders();
        headers.add("students_count", String.valueOf(studentRepository.getStudentsCount(departmentId)));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(studentRepository.getStudentsView(departmentId, Integer.parseInt(page), Integer.parseInt(pageSize)));
    }

    @GetMapping("/dep_{N}/students/{id}")
    public StudentView findStudentById(@PathVariable("N") int departmentId, @PathVariable("id") String studentId) {
        validateDepartmentId(departmentId);
        validateStudentId(studentId);
        return studentRepository.getStudentById(departmentId, studentId);
    }

    @PostMapping("/dep_{N}/students/data")
    public void addNewStudent(@RequestBody StudentView student, @PathVariable("N") int departmentId) {
        validateDepartmentId(departmentId);
        studentRepository.addNewStudent(departmentId, student);
    }

    @PutMapping("/dep_{N}/students/data")
    public void updateStudent(@RequestBody StudentView student, @PathVariable("N") int departmentId) {
        validateDepartmentId(departmentId);
        validateStudentId(student.getStudentId());
        studentRepository.updateStudent(departmentId, student);
    }

    @DeleteMapping("/dep_{N}/students/{id}")
    public void deleteStudentById(@PathVariable("N") int departmentId, @PathVariable("id") String studentId) {
        validateDepartmentId(departmentId);
        validateStudentId(studentId);
        studentRepository.deleteStudentById(departmentId, studentId);
    }
}
