package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Lesson;
import project.repository.LessonRepository;

import java.util.ArrayList;
import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RestController("LessonControllerBean")
@RequiredArgsConstructor
public class LessonController {

    private final LessonRepository lessonRepository;

    @GetMapping("/dep_{N}/work_plan/data")
    public ResponseEntity<List<Lesson>> getLessonsPaginated(@PathVariable("N") int department,
                                                            @RequestParam String page,
                                                            @RequestParam String size,
                                                            @RequestParam(value = "key", required = false) String keyWord) {
        validateDepartmentId(department);
        validatePaginationParams(page, size);
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
            body = body.subList(Math.max(start, body.size()), Math.max(end, body.size()));
        }
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(body);
    }

    @PostMapping("/dep_{N}/work_plan/data")
    public int addLesson(@PathVariable("N") int department, @RequestBody Lesson lesson) {
        lessonRepository.addNewLesson(department, lesson);
        return lessonRepository.getMaxId(department);
    }

    @GetMapping("/dep_{N}/work_plan/{id}")
    public List<Lesson> findLessonById(@PathVariable("N") int department, @PathVariable("id") int id) {
        return lessonRepository.getLessonById(department, id);
    }

    @PutMapping("/dep_{N}/work_plan/{id}")
    public void changeLesson(@PathVariable("N") int department, @PathVariable("id") int id, @RequestBody Lesson lesson) {
        lessonRepository.changeLesson(department, id, lesson);
    }

    @DeleteMapping("/dep_{N}/work_plan/{id}")
    public void deleteLessonById(@PathVariable("N") int department, @PathVariable("id") int id) {
        lessonRepository.deleteLessonById(department, id);
    }

}
