package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;

@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter

@Entity
@Table(name = "Student")
public class Student {

    @Id
    @JsonProperty("studentId")
    private String studentId;

    @Column(name = "subdepartment_id")
    @JsonProperty("subdepartmentId")
    private Short subdepartmentId;

    @Column
    @JsonProperty("fullName")
    private String name;

    @ManyToOne
    @JoinColumn(insertable = false, updatable = false)
    @Fetch(FetchMode.JOIN)
    private Subdepartment subdepartment;

    @Transient
    @JsonProperty("subdepartmentName")
    private String subdepartmentName;

    @Override
    public String toString() {
        return "Student{" +
                "studentId='" + studentId + '\'' +
                ", subdepartmentId=" + subdepartmentId +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Student student = (Student) o;

        if (getSubdepartmentId() != student.getSubdepartmentId()) return false;
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
