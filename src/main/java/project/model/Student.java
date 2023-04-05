package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Student {
   @JsonProperty("studentId")
   private String studentId;
   @JsonProperty("subdepartmentId")
   private short subDepartmentId;
}
