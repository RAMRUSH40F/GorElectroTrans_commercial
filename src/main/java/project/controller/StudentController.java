package project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Student;
import project.model.projection.StudentIdName;
import project.service.StudentServiceImpl;

import java.util.List;
import java.util.Optional;

import static project.exceptions.Validator.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class StudentController {

    private final StudentServiceImpl studentService;

    @GetMapping("/dep_{N}/students/data")
    public ResponseEntity<List<Student>> findStudents(@PathVariable("N") String depId,
                                                      Optional<String> key,
                                                      Pageable paginationParams,
                                                      @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        int departmentId = validateDepartmentId(depId);
        Page<Student> studentPage = studentService.findAllWithPagination(departmentId, key, paginationParams);

        HttpHeaders headers = new HttpHeaders();
        headers.add("students_count", String.valueOf(studentPage.getTotalElements()));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(studentPage.getContent());
    }

    @GetMapping("/dep_{N}/students/getByName")
    public ResponseEntity<List<StudentIdName>> findStudentsByName(@PathVariable("N") String depId,
                                                            @RequestParam String key,
                                                            @RequestParam(required = false) Integer limit,
                                                            @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        int departmentId = validateDepartmentId(depId);
        List<StudentIdName> students = studentService.findByNameStartsWith(departmentId, key, limit);

        HttpHeaders headers = new HttpHeaders();
        headers.add("students_count", String.valueOf(students.size()));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(students);
    }


    @PostMapping("/dep_{N}/students/data")
    public ResponseEntity<Student> addNewStudent(@PathVariable("N") String depId,
                                                 @RequestBody Student student,
                                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        HttpHeaders headers = new HttpHeaders();
        Student createdStudent = studentService.addNewStudentBySubdepartmentName(departmentId, student);
        return ResponseEntity.status(HttpStatus.CREATED).headers(headers).body(createdStudent);

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
