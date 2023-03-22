package project.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Lesson;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class LessonRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    NamedParameterJdbcTemplate namedJdbcTemplate;

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
}
