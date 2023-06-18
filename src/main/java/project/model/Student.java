package project.model;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.lang.Nullable;

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
    @JsonIgnore
    private Short subdepartmentId;

    @Column
    @JsonProperty("fullName")
    private String name;

    @ManyToOne
    @JoinColumn(insertable = false, updatable = false)
    @Fetch(FetchMode.JOIN)
    @JsonIgnore
    @Nullable
    private Subdepartment subdepartment;

    @JsonGetter("subdepartmentName")
    public @Nullable String getSubdepartmentName() {
        if (subdepartment != null) {
            return subdepartment.getName();
        }
        return null;
    }

    @JsonSetter("subdepartmentName")
    public void setSubdepartmentName(String name) {
        if (subdepartment == null) {
            subdepartment = new Subdepartment();
            subdepartment.setName(name);
        }
        subdepartment.setName(name);
    }


    @Override
    public String toString() {
        return "Student{" +
                "studentId='" + studentId + '\'' +
                ", name='" + name + '\'' +
                ", subdepartment=" + subdepartment +
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
