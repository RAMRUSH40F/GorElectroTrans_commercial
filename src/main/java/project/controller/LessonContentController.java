package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.exceptions.InvalidDepartmentException;
import project.model.LessonContent;
import project.repository.LessonContentRepository;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;

@RestController
@RequiredArgsConstructor
public class LessonContentController {

    private final LessonContentRepository repository;

    @GetMapping("/dep_{N}/content/data")
    public List<LessonContent> getAll(@PathVariable("N") Integer departmentId) {
        validateDepartmentId(departmentId);
        return repository.getAll(departmentId);
    }

    @GetMapping("/dep_{N}/content/{id}")
    public byte[] getById(@PathVariable("N") Integer departmentId, @PathVariable("id") Integer lessonId) {
        validateDepartmentId(departmentId);
        return repository.getById(lessonId, departmentId).getFile();
    }

    @PostMapping("/dep_{N}/content/{id}")
    public boolean create(
            @PathVariable("N") Integer departmentId,
            @PathVariable("id") Integer lessonId,
            @RequestBody byte[] content) {
            if (content == null ) {
                return false;
            }
        validateDepartmentId(departmentId);
        return repository.create(new LessonContent(content, lessonId), departmentId);
    }

    @DeleteMapping("/dep_{N}/content/{id}")
    public boolean deleteById(@PathVariable("N") Integer departmentId, @PathVariable("id") Integer lessonId) {
        validateDepartmentId(departmentId);
        return repository.deleteById(lessonId, departmentId);
    }

}
