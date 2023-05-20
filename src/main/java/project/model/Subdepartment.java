package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@AllArgsConstructor
@Builder
@Entity
@NoArgsConstructor
public class Subdepartment {
    @Id
    @JsonProperty("id")
    private Short id;

    @Column
    @JsonProperty("name")
    private String name;

}
