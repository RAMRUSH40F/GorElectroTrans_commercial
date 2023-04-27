package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.StudentView;
import project.repository.StudentRepository;
import project.security.JwtAuthorizationService;

import java.util.List;

import static project.exceptions.Validator.*;

@RestController
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/students/data")
    public ResponseEntity<List<StudentView>> getStudentPage(@PathVariable("N") String depId,
                                                            @RequestParam(value = "page") String page,
                                                            @RequestParam(value = "size") String pageSize,
                                                            @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validatePaginationParams(page, pageSize);
        auth.authorize(jwtToken, departmentId);

        HttpHeaders headers = new HttpHeaders();
        headers.add("students_count", String.valueOf(studentRepository.getStudentsCount(departmentId)));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(studentRepository.getStudentsView(departmentId, Integer.parseInt(page), Integer.parseInt(pageSize)));
    }

    @GetMapping("/dep_{N}/students/{id}")
    public StudentView findStudentById(@PathVariable("N") String depId,
                                       @PathVariable("id") String studentId,
                                       @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validateStudentId(studentId);
        auth.authorize(jwtToken, departmentId);

        return studentRepository.getStudentById(departmentId, studentId);
    }

    @PostMapping("/dep_{N}/students/data")
    public StudentView addNewStudent(@PathVariable("N") String depId,
                                     @RequestBody StudentView student,
                                     @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        auth.authorize(jwtToken, departmentId);

        return studentRepository.addNewStudent(departmentId, student);
    }

    @PutMapping("/dep_{N}/students/data")
    public void updateStudent(@PathVariable("N") String depId,
                              @RequestBody StudentView student,
                              @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validateStudentId(student.getStudentId());
        auth.authorize(jwtToken, departmentId);

        studentRepository.updateStudent(departmentId, student);
    }

    @DeleteMapping("/dep_{N}/students/{id}")
    public void deleteStudentById(@PathVariable("N") String depId,
                                  @PathVariable("id") String studentId,
                                  @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {

        Integer departmentId = validateDepartmentId(depId);
        validateStudentId(studentId);
        auth.authorize(jwtToken, departmentId);

        studentRepository.deleteStudentById(departmentId, studentId);
    }
}
