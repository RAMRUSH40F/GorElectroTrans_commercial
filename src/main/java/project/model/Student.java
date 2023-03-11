package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Student {
   @JsonProperty("student_id")
   private String studentId;
   @JsonProperty("subdepartment_id")
   private short subDepartmentId;
}
