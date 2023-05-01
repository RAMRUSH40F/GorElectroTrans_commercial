package project.repository;

import project.model.Student;
import project.model.StudentView;

import java.util.List;

public interface StudentRepository {
    StudentView addNewStudent(int departmentId, StudentView studentView);

    List<StudentView> getStudentsView(int departmentID, Integer page, Integer pageSize);

    StudentView getStudentById(int departmentId, String studentId);

    void deleteStudentById(int departmentId, String studentId);

    void updateStudent(int departmentId, StudentView studentView);

    void addNewStudentByDepId(int departmentId, Student student);

    List<Student> getStudentsIdList(int departmentId);

    Integer getStudentsCount(int departmentId);
}
