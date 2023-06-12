package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Lesson;
import project.service.LessonServiceImpl;

import java.util.List;

import static project.exceptions.Validator.validateDepartmentId;
import static project.exceptions.Validator.validatePaginationParams;

@RestController("LessonControllerBean")
@RequiredArgsConstructor
public class LessonController {

    private final LessonServiceImpl lessonService;

    @GetMapping("/dep_{N}/work_plan/data")
    public ResponseEntity<List<Lesson>> getLessonsPaginated(@PathVariable("N") String depId,
                                                            @RequestParam String page,
                                                            @RequestParam String size,
                                                            @RequestParam(value = "key", required = false) String keyWord,
                                                            @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        validatePaginationParams(page, size);

        Page<Lesson> lessonPage =
                lessonService.findAllByNullableKeywordWithPagination(departmentId, keyWord, Integer.parseInt(page), Integer.parseInt(size));

        HttpHeaders headers = new HttpHeaders();
        headers.add("lessons_count", String.valueOf(lessonPage.getTotalElements()));

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(lessonPage.getContent());
    }

    @PostMapping("/dep_{N}/work_plan/data")
    public int addLesson(@PathVariable("N") String depId,
                         @RequestBody Lesson lesson,
                         @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);

        //На доработку. Сейчас фронт готовится принять lesson.id int
        return lessonService.addNewLesson(departmentId, lesson).getId();
    }


    @PutMapping("/dep_{N}/work_plan/{id}")
    public void changeLesson(@PathVariable("N") String depId,
                             @PathVariable("id") int id,
                             @RequestBody Lesson lesson,
                             @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        lessonService.changeLesson(departmentId, id, lesson);
    }

    @DeleteMapping("/dep_{N}/work_plan/{id}")
    public void deleteLessonById(@PathVariable("N") String depId,
                                 @PathVariable("id") int id,
                                 @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        Integer departmentId = validateDepartmentId(depId);
        lessonService.deleteLessonById(departmentId, id);
    }

}
