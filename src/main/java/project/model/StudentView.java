package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class StudentView {
    @JsonProperty("studentId")
    private String studentId;
    @JsonProperty("subdepartmentName")
    private String subDepartment;
    @JsonProperty("fullName")
    private String fullName;
}
