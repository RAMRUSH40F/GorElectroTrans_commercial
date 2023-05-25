package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import project.dataSource.DynamicDataSourceContextHolder;
import project.model.Subdepartment;
import project.service.SubdepartmentServiceImpl;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;


@RequiredArgsConstructor
@RestController("SubdepartmentControllerBean")
public class SubdepartmentController {

    private final SubdepartmentServiceImpl service;

    @GetMapping("/dep_{N}/subdep/data")
    public List<Subdepartment> getAll(@PathVariable("N") String depId,
                                      @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        return service.findAll(departmentId);
    }

    @PostMapping("/dep_{N}/subdep/data")
    public Subdepartment addNewSubdepartment(@PathVariable("N") String depId,
                                             @RequestBody Subdepartment subdepartment,
                                             @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        return service.save(departmentId, subdepartment);

    }

    @PutMapping("/dep_{N}/subdep/data")
    public Subdepartment updateSubdepartmentName(@PathVariable("N") String depId,
                                                 @RequestBody Subdepartment subdepartment,
                                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        DynamicDataSourceContextHolder.setCurrentDataSource("DEP_" + departmentId);
        return service.updateName(departmentId, subdepartment);
    }

    @DeleteMapping("/dep_{N}/subdep/{id}")
    public void deleteSubdepartmentById(@PathVariable("N") String depId,
                                        @PathVariable("id") short id,
                                        @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        service.deleteById(departmentId, id);
    }


}
