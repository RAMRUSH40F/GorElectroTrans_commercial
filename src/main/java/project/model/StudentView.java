package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class StudentView {
    @JsonProperty("student_id")
    private String studentId;
    @JsonProperty("subdepartment_name")
    private String subDepartment;
    @JsonProperty("full_name")
    private String fullName;
}
