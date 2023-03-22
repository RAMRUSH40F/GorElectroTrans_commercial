package project.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.exceptions.InvalidDepartmentException;
import project.model.Lesson;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository("LessonRepositoryBean")
public class LessonRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private NamedParameterJdbcTemplate namedJdbcTemplate;

    public void addNewLesson(int departmentId, Lesson lesson) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        String databaseName = "DEP_" + departmentId;

        Map<String, Object> parameters = new HashMap<String, Object>();

        parameters.put("topic", lesson.getTopic());
        parameters.put("duration", lesson.getDuration());
        parameters.put("date", lesson.getDate());
        parameters.put("teacher", lesson.getTeacher());
        parameters.put("peoplePlanned", lesson.getPeoplePlanned());

        namedJdbcTemplate.update(
                "INSERT INTO " + databaseName + ".lesson (topic,duration,date,teacher,people_planned)" +
                        "VALUES (:topic,:duration,:date," +
                        " :teacher, :peoplePlanned);",
                parameters);
    }

    public void deleteAllLessons(int departmentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        String databaseName = "DEP_" + departmentId;

        jdbcTemplate.update(
                "DELETE FROM " + databaseName + ".lesson ;");
    }

    public List<Lesson> getLessonsIdList(int departmentId) {
        if (departmentId > 15 || departmentId < 1) {
            throw new RuntimeException("Invalid department id, it has to be in [1,15] interval");
        }
        String databaseName = "DEP_" + departmentId;
        List<Lesson> lessonsIdList = jdbcTemplate.query("SELECT id FROM " +
                databaseName + ".lesson", new RowMapper<Lesson>() {
            @Override
            public Lesson mapRow(ResultSet rs, int rowNum) throws SQLException {
                return Lesson.builder()
                        .id(rs.getInt("id"))
                        .build();
            }
        });
        return lessonsIdList;
    }

    public List<Lesson> getAllLessonAdmin() {
        return null;
    }

    public List<Lesson> getAllLessons(int departmentId) {
        return namedJdbcTemplate.query("SELECT * FROM DEP_" + departmentId + ".lesson", (rs, rowNum) -> Lesson.builder().
                id(rs.getInt("id")).
                topic(rs.getString("topic")).
                duration(rs.getFloat("duration")).
                date(rs.getDate("date")).
                teacher(rs.getString("teacher")).
                peoplePlanned(rs.getInt("people_planned")).build());
    }

    public List<Lesson> getLessonById(int departmentN, int id) {
        return namedJdbcTemplate.query("SELECT * FROM DEP_" + departmentN + ".lesson WHERE id=" + id, (rs, rowNum) -> Lesson.builder().
                id(rs.getInt("id")).
                topic(rs.getString("topic")).
                duration(rs.getFloat("duration")).
                date(rs.getDate("date")).
                teacher(rs.getString("teacher")).
                peoplePlanned(rs.getInt("people_planned")).build());

    }

    public void changeLesson(int department, int id, Lesson changed_lesson) {
        String query = new StringBuilder()
                .append("UPDATE DEP_")
                .append(department)
                .append(".lesson SET topic=")
                .append(changed_lesson.getTopic())
                .append(", duration=")
                .append(changed_lesson.getDuration())
                .append(", date")
                .append(changed_lesson.getDate())
                .append(", teacher=")
                .append(changed_lesson.getTeacher())
                .append(", people_planned=")
                .append(changed_lesson.getPeoplePlanned())
                .append(" WHERE id='")
                .append(changed_lesson.getId())
                .append("'")
                .toString();

        jdbcTemplate.execute(query);
    }

    public void deleteLessonById(int department, int id) {
        if (department > 15 || department < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
        String query = new StringBuilder()
                .append("DELETE FROM DEP_")
                .append(department)
                .append(".lesson WHERE id=")
                .append(id)
                .toString();
        jdbcTemplate.execute(query);
    }
}
