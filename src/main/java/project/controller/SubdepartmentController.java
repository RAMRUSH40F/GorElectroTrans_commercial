package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import project.model.Subdepartment;
import project.repository.SubdepartmentRepository;
import project.security.JwtAuthorizationService;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;


@RequiredArgsConstructor
@RestController("SubdepartmentControllerBean")
public class SubdepartmentController {

    private final SubdepartmentRepository subdepartmentRepository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/subdep/data")
    public List<Subdepartment> getAll(@PathVariable("N") String depId,
                                      @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        auth.authorize(jwtToken, departmentId);

        return subdepartmentRepository.getAll(departmentId);
    }

    @PostMapping("/dep_{N}/subdep/data")
    public Subdepartment addNewSubdepartment(@PathVariable("N") String depId,
                                             @RequestBody Subdepartment subdepartment,
                                             @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        auth.authorize(jwtToken, departmentId);

        return subdepartmentRepository.addNewSubdepartment(departmentId, subdepartment);

    }

    @PutMapping("/dep_{N}/subdep/data")
    public Subdepartment updateSubdepartmentName(@PathVariable("N") String depId,
                                                 @RequestBody Subdepartment subdepartment,
                                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        auth.authorize(jwtToken, departmentId);

        return subdepartmentRepository.updateSubdepartmentName(departmentId, subdepartment);
    }

    @DeleteMapping("/dep_{N}/subdep/{id}")
    public void deleteSubdepartmentById(@PathVariable("N") String depId,
                                        @PathVariable("id") short id,
                                        @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        auth.authorize(jwtToken, departmentId);

        subdepartmentRepository.deleteSubdepartmentById(departmentId, id);
    }


}
