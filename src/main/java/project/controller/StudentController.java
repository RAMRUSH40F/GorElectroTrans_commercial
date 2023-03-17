package project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.exceptions.InvalidStudentIdException;
import project.model.StudentView;
import project.repository.StudentRepository;

import java.util.List;

@RestController
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/dep_{N}/students/data")
    public List<StudentView> getAllStudents(@PathVariable("N") int departmentId) {
        return studentRepository.getStudentsView(departmentId);
    }

    @GetMapping("/dep_{N}/students/{id}")
    public StudentView findStudentById(@PathVariable("N") int departmentId, @PathVariable("id") String studentId) {
        if (studentId.length() != 5) {
            throw new InvalidStudentIdException();
        }
        return studentRepository.getStudentById(departmentId, studentId);
    }

    @PostMapping("/dep_{N}/students/data")
    public void addNewStudent(@RequestBody StudentView student, @PathVariable("N") int departmentId) {
        studentRepository.addNewStudent(departmentId, student);
    }

    @PutMapping("/dep_{N}/students/data")
    public void updateStudent(@RequestBody StudentView student, @PathVariable("N") int departmentId) {
        studentRepository.updateStudent(departmentId, student);
    }

    @DeleteMapping("/dep_{N}/students/{id}")
    public void deleteStudentById(@PathVariable("N") int departmentId, @PathVariable("id") String studentId) {
        if (studentId.length() != 5) {
            throw new InvalidStudentIdException();
        }
        studentRepository.deleteStudentById(departmentId, studentId);
    }
}
