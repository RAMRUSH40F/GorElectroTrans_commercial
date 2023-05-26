package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Lesson;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("LessonRepositoryBean")
@RequiredArgsConstructor
public class LessonRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedJdbcTemplate;
    private final LessonContentRepository lessonContentRepository;


    public void addNewLesson(int department, Lesson lesson) {

        String databaseName = "DEP_" + department;

        Map<String, Object> parameters = new HashMap<String, Object>();

        parameters.put("topic", lesson.getTopic());
        parameters.put("duration", lesson.getDuration());
        parameters.put("date", lesson.getDate());
        parameters.put("teacher", lesson.getTeacher());
        parameters.put("teacherPost", lesson.getTeacherPost());
        parameters.put("peoplePlanned", lesson.getPeoplePlanned());
        parameters.put("isHeld", lesson.isHeld());

        namedJdbcTemplate.update(
                "INSERT INTO " + databaseName + ".lesson (topic,duration,date,teacher,people_planned,isHeld,teacherPost)" +
                        "VALUES (:topic,:duration,:date," +
                        " :teacher, :peoplePlanned,:isHeld,:teacherPost);", parameters);
    }


    public List<Lesson> getLessonsIdList(int department) {
        String databaseName = "DEP_" + department;
        List<Lesson> lessonsIdList = jdbcTemplate.query("SELECT id FROM " +
                databaseName + ".lesson", (rs, rowNum) -> Lesson.builder()
                .id(rs.getInt("id"))
                .build());
        return lessonsIdList;
    }

    public Integer getLessonsCount(int department) {
        String databaseName = "DEP_" + department;
        return jdbcTemplate.queryForObject("SELECT COUNT(id) FROM " +
                databaseName + ".lesson AS COUNT", Integer.class);
    }

    public List<Lesson> getLessonByKeyword(int departmentId, String key) {
        Map<String, String> parameters = new HashMap<>();
        parameters.put("key", "%" + key + "%");

        String GET_LESSONS_SQL = String.format("SELECT * FROM DEP_%d.lesson WHERE topic LIKE :key OR date LIKE :key OR teacher LIKE :key ORDER BY date DESC",
                departmentId);

        List<Lesson> lessons = namedJdbcTemplate.query(
                GET_LESSONS_SQL, parameters, (rs, rowNum) -> Lesson.builder()
                        .id(rs.getInt("id"))
                        .topic(rs.getString("topic"))
                        .duration(rs.getFloat("duration"))
                        .date(rs.getDate("date"))
                        .teacher(rs.getString("teacher"))
                        .teacherPost(rs.getString("teacherPost"))
                        .peoplePlanned(rs.getInt("people_planned"))
                        .build());
        for (Lesson x : lessons) {
            x.setLessonContent(lessonContentRepository.getFileNamesByLessonId(departmentId, x.getId()));
        }
        return lessons;
    }


    public List<Lesson> getPagedLessons(int department, int page, int size) {
        String sqlQuery = "SELECT * FROM DEP_" + department + ".lesson" +
                " ORDER BY date DESC LIMIT " + ((page - 1) * size) + "," + size;
        List<Lesson> lessonList = namedJdbcTemplate.query(sqlQuery, (rs, rowNum) -> Lesson.builder().
                id(rs.getInt("id")).
                topic(rs.getString("topic")).
                duration(rs.getFloat("duration")).
                date(rs.getDate("date")).
                teacher(rs.getString("teacher")).
                teacherPost(rs.getString("teacherPost")).
                peoplePlanned(rs.getInt("people_planned")).isHeld(rs.getBoolean("isHeld")).build());
        for (Lesson x : lessonList) {
            x.setLessonContent(lessonContentRepository.getFileNamesByLessonId(department, x.getId()));
        }
        return lessonList;
    }

    public List<Lesson> getLessonById(int department, int id) {
        List<Lesson> lessonList = namedJdbcTemplate.query("SELECT * FROM DEP_" + department + ".lesson WHERE id=" + id,
                (rs, rowNum) -> Lesson.builder().
                        id(rs.getInt("id")).
                        topic(rs.getString("topic")).
                        duration(rs.getFloat("duration")).
                        date(rs.getDate("date")).
                        teacher(rs.getString("teacher")).
                        teacherPost(rs.getString("teacherPost")).
                        peoplePlanned(rs.getInt("people_planned")).isHeld(rs.getBoolean("isHeld")).build());
        for (Lesson x : lessonList) {
            x.setLessonContent(lessonContentRepository.getFileNamesByLessonId(department, x.getId()));
        }
        return lessonList;
    }

    public void changeLesson(int department, int id, Lesson changed_lesson) {
        String query = new StringBuilder()
                .append("UPDATE DEP_")
                .append(department)
                .append(".lesson SET topic='")
                .append(changed_lesson.getTopic())
                .append("', duration=")
                .append(changed_lesson.getDuration())
                .append(", date='")
                .append(changed_lesson.getDate())
                .append("', teacher='")
                .append(changed_lesson.getTeacher())
                .append("', teacherPost='")
                .append(changed_lesson.getTeacherPost())
                .append("', people_planned=")
                .append(changed_lesson.getPeoplePlanned())
                .append(" , isHeld=")
                .append(changed_lesson.isHeld())
                .append(" WHERE id='")
                .append(changed_lesson.getId())
                .append("'")
                .toString();

        jdbcTemplate.execute(query);
    }

    public void deleteLessonById(int department, int id) {
        String query = new StringBuilder()
                .append("DELETE FROM DEP_")
                .append(department)
                .append(".lesson WHERE id=")
                .append(id)
                .toString();
        jdbcTemplate.execute(query);
    }

    public int getMaxId(int department) {
        String query = new StringBuilder().append("SELECT MAX(id) AS id FROM DEP_")
                .append(department)
                .append(".lesson")
                .toString();
        int maxId = jdbcTemplate.query(query, (rs, rowNum) -> rs.getInt("id")).get(0);
        return maxId;
    }


}
