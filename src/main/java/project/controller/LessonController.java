package project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.exceptions.InvalidIdException;
import project.model.Lesson;
import project.repository.LessonRepository;

import java.util.List;

@RestController("LessonControllerBean")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @GetMapping("/dep_{N}/workplan/data")
    public List<Lesson> getAllLessons(@PathVariable("N") int department) {
        return lessonRepository.getAllLessons(department);
    }

    @PostMapping("/dep_{N}/workplan/data")
    public void addLesson(@PathVariable("N") int department, @RequestBody Lesson lesson) {
        lessonRepository.addNewLesson(department, lesson);

    }

    @GetMapping("/dep_{N}/workplan/{id}")
    public List<Lesson> findLessonById(@PathVariable("N") int department, @PathVariable("id") int id) {
        return lessonRepository.getLessonById(department, id);
    }

    @PutMapping("/dep_{N}/workplan/{id}")
    public void changeLesson(@PathVariable("N") int department, @PathVariable("id") int id, @RequestBody Lesson lesson) {
        lessonRepository.changeLesson(department, id, lesson);
    }

    @DeleteMapping("/dep_{N}/workplan/{id}")
    public void deleteLessonById(@PathVariable("N") int department, @PathVariable("id") String id) {
        if (id.length() != 5) {
            throw new InvalidIdException();
        }
        lessonRepository.deleteLessonById(department, Integer.valueOf(id).intValue());

    }


}
