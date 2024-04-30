package project.model.projection;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "Student")
public class StudentIdName {

    @Id
    @JsonProperty("studentId")
    private String studentId;

    @Column
    @JsonProperty("fullName")
    private String name;

    @Override
    public String toString() {
        return "Student{" +
                "studentId='" + studentId + '\'' +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        StudentIdName student = (StudentIdName) o;

        if (!getStudentId().equals(student.getStudentId())) return false;
        return getName().equals(student.getName());
    }

    @Override
    public int hashCode() {
        int result = getStudentId().hashCode();
        result = 31 * result + getName().hashCode();
        return result;
    }
}
