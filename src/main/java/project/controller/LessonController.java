package project.controller;

import org.springframework.web.bind.annotation.*;
import project.exceptions.InvalidIdException;
import project.exceptions.InvalidStudentIdException;
import project.model.Lesson;
import project.repository.LessonRepository;

import java.util.List;

@RestController
public class LessonController {
    LessonRepository lessonRepository;
    @GetMapping("/dep_{N}/workplan/data")
    public List<Lesson> getAllLessons(@PathVariable("N") int department) {
        return lessonRepository.getAllLesson(department);
    }
    @PostMapping("/dep_{N}/workplan/data")
        public void addLesson(@PathVariable("N") int department, @RequestBody Lesson lesson){
        lessonRepository.addNewLesson(department,lesson);

    }
    @GetMapping("/dep_{N}/workplan/{id}")
    public List<Lesson> findLesson(@PathVariable("N") int department, @PathVariable("id") int id){
        return lessonRepository.getOneLesson(department,id);
    }
    @PutMapping("/dep_{N}/workplan/{id}")
    public void changeLesson (@PathVariable("N") int department,@PathVariable("id") int id, @RequestBody Lesson lesson){
lessonRepository.changeLesson(department,id,lesson);
    }
    @DeleteMapping ("/dep_{N}/workplan/{id}")
    public void deleteLesson(@PathVariable("N") int department, @PathVariable("id") String id){
        if (id.length() != 5) {
            throw new InvalidIdException();
        }
        boolean isSuperAdmin = true;

        // Удалять студентов могут лишь супер-админы.
        if (isSuperAdmin) {
            lessonRepository.deleteLesson(department,Integer.valueOf(id).intValue());
        } else {
            throw new RuntimeException("Unauthorised person!");
        }
    }


}
