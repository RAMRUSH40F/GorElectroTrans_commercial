package project.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import project.dataSource.DynamicDataSourceContextHolder;
import project.model.Lesson;
import project.service.reportService.TeacherProfession;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class LessonServiceImplSimpleTest {

    @Autowired
    LessonServiceImpl lessonService;

    @BeforeAll
    static void setDataBaseToCancelException() {
        DynamicDataSourceContextHolder.setCurrentDataSource("DEP_1");
    }

    @Test
    void getPagedLessons_returnNotNull() {
        Pageable pageable = PageRequest.of(1, 15);
        List<Lesson> lessonList = lessonService.findAllByNullableKeywordWithPagination(1, null, pageable).toList();
        System.out.println(lessonList);

        assertNotNull(lessonList);

    }

    @Test
    void getLessonsCount_returnNoNull() {
        Integer num = lessonService.getLessonsCount(1);

        assertNotNull(num);
    }

    @Test
    void getLessonByKeyword_returnNotNull() {
        Pageable pageable = PageRequest.of(1, 1);
        List<Lesson> lessonList = lessonService.findAllByNullableKeywordWithPagination(1, Optional.of("gag"), pageable).toList();
        System.out.println(lessonList);

        assertNotNull(lessonList);
    }


    @Test
    void addNewLesson_lessonCountPlusOneResult() {
        Integer num = lessonService.getLessonsCount(4);
        Object[] res = new Object[]{"Ремонт нового подвижного состава трамваев_тест", 2.6f, new Date(1683014400L), "Левицкий Леонид Константинович.", 52, TeacherProfession.MASTER.getProfession()};

        lessonService.addNewLesson(4,
                Lesson.builder()
                        .topic((String) res[0])
                        .duration((Float) res[1])
                        .date((Date) res[2])
                        .teacher((String) res[3])
                        .peoplePlanned((Integer) res[4])
                        .teacherPost((String) res[5])
                        .isHeld(true).build());

        Integer num2 = lessonService.getLessonsCount(4);
        assertTrue(num < num2);
    }


}