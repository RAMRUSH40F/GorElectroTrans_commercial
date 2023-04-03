package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Subdepartment {
    @JsonProperty("id")
    private Short id;
    @JsonProperty("name")
    private String name;

}
