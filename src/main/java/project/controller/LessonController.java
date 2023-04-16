package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.model.Lesson;
import project.model.MyToken;
import project.model.User;
import project.repository.LessonRepository;
import project.security.JwtAuthorizationService;

import java.util.List;

import static project.exceptions.Validator.*;

@RestController("LessonControllerBean")
@RequiredArgsConstructor
public class LessonController {

    private final LessonRepository lessonRepository;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/work_plan/data")
    public ResponseEntity<List<Lesson>> getPagedLessons(@PathVariable("N") int departmentId,
                                                        @RequestParam String page,
                                                        @RequestParam String size,
                                                        @RequestBody MyToken token) {
        validateDepartmentId(departmentId);
        validatePaginationParams(page, size);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("lessons_count", String.valueOf(lessonRepository.getLessonsCount(departmentId)));
        return ResponseEntity
                .ok()
                .headers(headers)
                .body(lessonRepository.getPagedLessons(departmentId, Integer.parseInt(page), Integer.parseInt(size)));
    }

    @PostMapping("/dep_{N}/work_plan/data")
    public int addLesson(@PathVariable("N") int departmentId,
                         @RequestBody Lesson lesson,
                         @RequestBody MyToken token) {
        lessonRepository.addNewLesson(departmentId, lesson);
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        return lessonRepository.getMaxId(departmentId);
    }

    @GetMapping("/dep_{N}/work_plan/{id}")
    public List<Lesson> findLessonById(@PathVariable("N") int departmentId,
                                       @PathVariable("id") int id,
                                       @RequestBody MyToken token) {
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        return lessonRepository.getLessonById(departmentId, id);
    }

    @PutMapping("/dep_{N}/work_plan/{id}")
    public void changeLesson(@PathVariable("N") int departmentId,
                             @PathVariable("id") int id,
                             @RequestBody Lesson lesson,
                             @RequestBody MyToken token) {
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        lessonRepository.changeLesson(departmentId, id, lesson);
    }

    @DeleteMapping("/dep_{N}/work_plan/{id}")
    public void deleteLessonById(@PathVariable("N") int departmentId,
                                 @PathVariable("id") int id,
                                 @RequestBody MyToken token) {
        User user = auth.decodeUserFromToken(token.getToken());
        validateAuth(user, departmentId);
        lessonRepository.deleteLessonById(departmentId, id);

    }


}
