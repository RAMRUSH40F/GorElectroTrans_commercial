package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Student;
import project.service.StudentServiceImpl;

import java.util.List;

import static project.exceptions.Validator.*;

@RestController
@RequiredArgsConstructor
public class StudentController {

    private final StudentServiceImpl studentService;

    @GetMapping("/dep_{N}/students/data")
    public ResponseEntity<List<Student>> findStudents(@PathVariable("N") String depId,
                                                      @RequestParam(value = "page") String page,
                                                      @RequestParam(value = "size") String pageSize,
                                                      @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        int departmentId = validateDepartmentId(depId);
        validatePaginationParams(page, pageSize);

        HttpHeaders headers = new HttpHeaders();
        headers.add("students_count", String.valueOf(studentService.getStudentsCount(departmentId)));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(studentService.findAllPaginated(departmentId, Integer.parseInt(page), Integer.parseInt(pageSize)));
    }


    @PostMapping("/dep_{N}/students/data")
    public Student addNewStudent(@PathVariable("N") String depId,
                                 @RequestBody Student student,
                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        return studentService.addNewStudent(departmentId, student);
    }

    @PutMapping("/dep_{N}/students/data")
    public void updateStudent(@PathVariable("N") String depId,
                              @RequestBody Student student,
                              @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validateStudentId(student.getStudentId());
        studentService.updateStudent(departmentId, student);
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
