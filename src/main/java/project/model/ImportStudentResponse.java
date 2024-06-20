package project.model;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

public class ImportStudentResponse {

    private final List<Student> createdStudents;
    private final List<String> invalidStudentsId;

    public ImportStudentResponse(List<Student> createdStudents,List<String> invalidStudentsId) {
        this.createdStudents  = new ArrayList<Student>(createdStudents);
        this.invalidStudentsId = new ArrayList<String>(invalidStudentsId);
    }

    public List<Student> getCreatedStudents() {
        return new ArrayList<Student>(createdStudents);
    }

    public List<String> getInvalidStudentsId() {
        return new ArrayList<String>(invalidStudentsId);
    }
}
