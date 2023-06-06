package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

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
    private short subDepartmentId;

    @Column
    @JsonProperty("fullName")
    private String name;

    @Transient
    @JsonProperty("subdepartmentName")
    private String subDepartmentName;
}
