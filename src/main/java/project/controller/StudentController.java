package project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.model.StudentView;
import project.repository.StudentRepository;

import java.util.List;

@RestController
public class StudentController {

    @Autowired
    StudentRepository studentRepository;

    @GetMapping("/dep_{n}/students/data")
    public List<StudentView> getAllStudents(@PathVariable("n") String dep_n) {
        // Проверка на роль.
        boolean isSuperAdmin = true;

        int departmentId = Integer.parseInt(dep_n);

        if (isSuperAdmin) {
            return studentRepository.getStudentsAdminView(departmentId);
        } else {
            return studentRepository.getStudentsView(departmentId);
        }

    }


    @PostMapping("/")
    public void addNewStudent() {

    }

    @DeleteMapping("/")
    public void deleteStudentById() {
    }
}
