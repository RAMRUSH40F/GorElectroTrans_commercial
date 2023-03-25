package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import project.model.Subdepartment;
import project.repository.SubdepartmentRepository;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;

@RestController
@RequiredArgsConstructor
public class SubdepartmentController {

    private final SubdepartmentRepository subdepartmentRepository;

    @GetMapping("/dep_{N}/subdep/data")
    public List<Subdepartment> getAll(@PathVariable("N") Integer departmentId) {
        validateDepartmentId(departmentId);
        return subdepartmentRepository.getAll(departmentId);
    }


}
