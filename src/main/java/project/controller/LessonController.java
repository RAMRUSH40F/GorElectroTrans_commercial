package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Lesson;
import project.monitoring.MetricsProducer;
import project.service.LessonServiceImpl;

import java.util.List;
import java.util.Optional;

import static project.exceptions.Validator.validateDepartmentId;

@RestController("LessonControllerBean")
@RequiredArgsConstructor
public class LessonController {

    private final LessonServiceImpl lessonService;
    private final MetricsProducer metricsProducer;

    @GetMapping("/dep_{N}/work_plan/data")
    public ResponseEntity<List<Lesson>> findLessonsWithPagination(@PathVariable("N") String depId,
                                                                  Pageable paginationParams,
                                                                  Optional<String> key,
                                                                  @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        Page<Lesson> lessonPage =
                lessonService.findAllByNullableKeywordWithPagination(departmentId, key, paginationParams);

        HttpHeaders headers = new HttpHeaders();
        headers.add("lessons_count", String.valueOf(lessonPage.getTotalElements()));

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(lessonPage.getContent());
    }

    @PostMapping("/dep_{N}/work_plan/data")
    public Lesson createLesson(@PathVariable("N") String depId,
                               @RequestBody Lesson lesson,
                               @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        metricsProducer.pushCreateLessonRequest();
        return lessonService.addNewLesson(departmentId, lesson);
    }


    @PutMapping("/dep_{N}/work_plan/{id}")
    public Lesson changeLesson(@PathVariable("N") String depId,
                               @PathVariable("id") int id,
                               @RequestBody Lesson lesson,
                               @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        return lessonService.changeLesson(departmentId, lesson);
    }

    @DeleteMapping("/dep_{N}/work_plan/{id}")
    public void deleteLessonById(@PathVariable("N") String depId,
                                 @PathVariable("id") int id,
                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        lessonService.deleteLessonById(departmentId, id);
    }

}
