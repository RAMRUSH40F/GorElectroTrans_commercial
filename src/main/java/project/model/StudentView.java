package project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class StudentView {
    private String studentId;
    private String subDepartment;
    private String fullName;
}
