package project.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import project.dataSource.DynamicDataSourceContextHolder;
import project.model.Lesson;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class LessonServiceSimpleTest {
    @Autowired
    LessonService lessonService;

    @BeforeAll
    static void setDataBaseToCancelException(){
        DynamicDataSourceContextHolder.setCurrentDataSource("DEP_1");
    }

    @Test
    void getLessonsCount() {
    }

    @Test
    void getLessonByKeyword() {
    }

    @Test
    void getPagedLessons_returnNotNull() {
        List<Lesson> lessonList = lessonService.getPagedLessons(1,1,15);
        System.out.println(lessonList);

        assertNotNull(lessonList);

    }
}