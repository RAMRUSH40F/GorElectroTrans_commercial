package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Student;
import project.service.StudentServiceImpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static project.exceptions.Validator.*;

@RestController
@RequiredArgsConstructor
public class StudentController {

    private final StudentServiceImpl studentService;

    @GetMapping("/dep_{N}/students/data")
    public ResponseEntity<List<Student>> findStudents(@PathVariable("N") String depId,
                                                       Pageable pageable,
                                                      /*@RequestParam(value = "key",required = false) String key,*/
                                                      @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
       int departmentId = validateDepartmentId(depId);
        Page<Student> studentPage = studentService.findAllWithPagination(pageable,departmentId);

        HttpHeaders headers = new HttpHeaders();
        headers.add("students_count", String.valueOf(studentPage.getTotalElements()));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(studentPage.getContent());
    }


    @PostMapping("/dep_{N}/students/data")
    public Student addNewStudent(@PathVariable("N") String depId,
                                 @RequestBody Student student,
                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        return studentService.addNewStudentBySubdepartmentName(departmentId, student);
    }

    @PutMapping("/dep_{N}/students/data")
    public Student updateStudent(@PathVariable("N") String depId,
                                 @RequestBody Student student,
                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validateStudentId(student.getStudentId());
        return studentService.updateStudent(departmentId, student);
    }

    @DeleteMapping("/dep_{N}/students/{id}")
    public void deleteStudentById(@PathVariable("N") String depId,
                                  @PathVariable("id") String studentId,
                                  @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {

        Integer departmentId = validateDepartmentId(depId);
        validateStudentId(studentId);
        studentService.deleteStudentById(departmentId, studentId);
    }
}
