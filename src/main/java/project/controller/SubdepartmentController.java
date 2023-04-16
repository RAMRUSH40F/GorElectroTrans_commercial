package project.controller;

import lombok.RequiredArgsConstructor;
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
    public List<Subdepartment> getAll(@PathVariable("N") Integer departmentId,
                                      @CookieValue(value = "token", defaultValue = "") String token) {
        validateDepartmentId(departmentId);
        auth.authorize(token,departmentId);
        return subdepartmentRepository.getAll(departmentId);
    }

    @PostMapping("/dep_{N}/subdep/data")
    public Subdepartment addNewSubdepartment(@PathVariable("N") int departmentId,
                                             @RequestBody Subdepartment subdepartment,
                                             @CookieValue(value = "token", defaultValue = "") String token) {
        validateDepartmentId(departmentId);
        auth.authorize(token,departmentId);
        return subdepartmentRepository.addNewSubdepartment(departmentId, subdepartment);

    }

    @PutMapping("/dep_{N}/subdep/data")
    public Subdepartment updateSubdepartmentName(@PathVariable("N") int departmentId,
                                                 @RequestBody Subdepartment subdepartment,
                                                 @CookieValue(value = "token", defaultValue = "") String token) {
        validateDepartmentId(departmentId);
        auth.authorize(token,departmentId);
        return subdepartmentRepository.updateSubdepartmentName(departmentId, subdepartment);
    }

    @DeleteMapping("/dep_{N}/subdep/{id}")
    public void deleteSubdepartmentById(@PathVariable("N") Integer departmentId,
                                        @PathVariable("id") short id,
                                        @CookieValue(value = "token", defaultValue = "") String token) {
        validateDepartmentId(departmentId);
        auth.authorize(token,departmentId);
        subdepartmentRepository.deleteSubdepartmentById(departmentId, id);
    }


}
