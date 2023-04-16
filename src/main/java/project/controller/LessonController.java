package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Lesson;
import project.repository.LessonRepository;
import project.security.JwtAuthorizationService;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RestController("LessonControllerBean")
@RequiredArgsConstructor
public class LessonController {

    private final LessonRepository lessonRepository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/work_plan/data")
    public ResponseEntity<List<Lesson>> getLessonsPaginated(@PathVariable("N") int department,
                                                            @RequestParam String page,
                                                            @RequestParam String size,
                                                            @RequestParam(value = "key", required = false) String keyWord,
                                                            @CookieValue(value = "token", defaultValue = "") String token) {
        validateDepartmentId(department);
        validatePaginationParams(page, size);
        auth.authorize(token, department);
        HttpHeaders headers = new HttpHeaders();

        List<Lesson> body;
        if (keyWord == null) {
            body = lessonRepository.getPagedLessons(department, Integer.parseInt(page), Integer.parseInt(size));
            headers.add("lessons_count", String.valueOf(lessonRepository.getLessonsCount(department)));
        } else {
            body = lessonRepository.getLessonByKeyword(department, keyWord);
            headers.add("lessons_count", String.valueOf(body.size()));
            int start = (Integer.parseInt(page) - 1) * Integer.parseInt(size);
            int end = Integer.parseInt(page) * Integer.parseInt(size);
            body = body.subList(Math.min(start, body.size()), Math.min(end, body.size()));
        }
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(body);
    }

    @PostMapping("/dep_{N}/work_plan/data")
    public int addLesson(@PathVariable("N") int departmentId,
                         @RequestBody Lesson lesson,
                         @CookieValue(value = "token", defaultValue = "") String token) {
        lessonRepository.addNewLesson(departmentId, lesson);
        auth.authorize(token,departmentId);
        return lessonRepository.getMaxId(departmentId);
    }

    @GetMapping("/dep_{N}/work_plan/{id}")
    public List<Lesson> findLessonById(@PathVariable("N") int departmentId,
                                       @PathVariable("id") int id,
                                       @CookieValue(value = "token", defaultValue = "") String token) {
        auth.authorize(token,departmentId);
        return lessonRepository.getLessonById(departmentId, id);
    }

    @PutMapping("/dep_{N}/work_plan/{id}")
    public void changeLesson(@PathVariable("N") int departmentId,
                             @PathVariable("id") int id,
                             @RequestBody Lesson lesson,
                             @CookieValue(value = "token", defaultValue = "") String token) {
        auth.authorize(token,departmentId);
        lessonRepository.changeLesson(departmentId, id, lesson);
    }

    @DeleteMapping("/dep_{N}/work_plan/{id}")

    public void deleteLessonById(@PathVariable("N") int departmentId,
                                 @PathVariable("id") int id,
                                 @CookieValue(value = "token", defaultValue = "") String token) {
        auth.authorize(token,departmentId);
        lessonRepository.deleteLessonById(departmentId, id);
    }

}
