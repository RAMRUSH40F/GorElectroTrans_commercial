package project.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.domain.Sort;

@Builder
@AllArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
public class StudentSortModel {
    @JsonProperty
    private String sortParam="id";
    @JsonProperty
    private Sort.Direction sortDirection=Sort.Direction.ASC;
}
