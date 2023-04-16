package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project.model.MyToken;
import project.model.Subdepartment;
import project.model.User;
import project.repository.SubdepartmentRepository;
import project.security.JwtAuthorizationService;

import java.util.List;

import static project.exceptions.Validator.validateAuth;
import static project.exceptions.Validator.validateDepartmentId;


@RequiredArgsConstructor
@RestController("SubdepartmentControllerBean")
public class SubdepartmentController {

    private final SubdepartmentRepository subdepartmentRepository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/subdep/data")
    public List<Subdepartment> getAll(@PathVariable("N") Integer departmentId,
                                      @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        return subdepartmentRepository.getAll(departmentId);
    }

    @PostMapping("/dep_{N}/subdep/data")
    public Subdepartment addNewSubdepartment(@PathVariable("N") int departmentId,
                                             @RequestBody Subdepartment subdepartment,
                                             @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        return subdepartmentRepository.addNewSubdepartment(departmentId, subdepartment);

    }

    @PutMapping("/dep_{N}/subdep/data")
    public Subdepartment updateSubdepartmentName(@PathVariable("N") int departmentId,
                                                 @RequestBody Subdepartment subdepartment,
                                                 @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        return subdepartmentRepository.updateSubdepartmentName(departmentId, subdepartment);
    }

    @DeleteMapping("/dep_{N}/subdep/{id}")
    public void deleteSubdepartmentById(@PathVariable("N") Integer departmentId,
                                        @PathVariable("id") short id,
                                        @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        subdepartmentRepository.deleteSubdepartmentById(departmentId, id);
    }


}
