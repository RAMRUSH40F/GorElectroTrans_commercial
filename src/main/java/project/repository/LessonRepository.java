package project.repository;

import lombok.RequiredArgsConstructor;
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

import static project.exceptions.Validator.validateDepartmentId;

@Repository("LessonRepositoryBean")
@RequiredArgsConstructor
public class LessonRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedJdbcTemplate;


    public void addNewLesson(int department, Lesson lesson) {
        validateDepartmentId(department);

        String databaseName = "DEP_" + department;

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

    public void deleteAllLessons(int department) {
        validateDepartmentId(department);
        String databaseName = "DEP_" + department;

        jdbcTemplate.update(
                "DELETE FROM " + databaseName + ".lesson ;");
    }

    public List<Lesson> getLessonsIdList(int department) {
        validateDepartmentId(department);

        String databaseName = "DEP_" + department;
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

    public Integer getLessonsCount(int department) {
        validateDepartmentId(department);
        String databaseName = "DEP_" + department;
        return jdbcTemplate.queryForObject("SELECT COUNT(id) FROM " +
                databaseName + ".lesson AS COUNT", Integer.class);
    }

    public List<Lesson> getPagedLessons(int department, int page, int size) {
        validateDepartmentId(department);
        String sqlQuery = "SELECT * FROM DEP_" + department + ".lesson" +
                " ORDER BY date DESC LIMIT " + ((page - 1) * size) + "," + size;
        return namedJdbcTemplate.query(sqlQuery, (rs, rowNum) -> Lesson.builder().
                id(rs.getInt("id")).
                topic(rs.getString("topic")).
                duration(rs.getFloat("duration")).
                date(rs.getDate("date")).
                teacher(rs.getString("teacher")).
                peoplePlanned(rs.getInt("people_planned")).build());
    }

    public List<Lesson> getLessonById(int department, int id) {
        validateDepartmentId(department);
        return namedJdbcTemplate.query("SELECT * FROM DEP_" + department + ".lesson WHERE id=" + id, (rs, rowNum) -> Lesson.builder().
                id(rs.getInt("id")).
                topic(rs.getString("topic")).
                duration(rs.getFloat("duration")).
                date(rs.getDate("date")).
                teacher(rs.getString("teacher")).
                peoplePlanned(rs.getInt("people_planned")).build());

    }

    public void changeLesson(int department, int id, Lesson changed_lesson) {
        validateDepartmentId(department);
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
                .append("', people_planned=")
                .append(changed_lesson.getPeoplePlanned())
                .append(" WHERE id='")
                .append(changed_lesson.getId())
                .append("'")
                .toString();

        jdbcTemplate.execute(query);
    }

    public void deleteLessonById(int department, int id) {
        validateDepartmentId(department);
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
        int id = jdbcTemplate.query(query, (rs, rowNum) -> rs.getInt("id")).get(0);
        return id;
    }

    public List<Lesson> getRecordsByChars(int departmentId, String key, int page, int size) {
        validateDepartmentId(departmentId);
        Map<String, String> parametrs = new HashMap<>();
        parametrs.put("key", "%" + key + "%");

        List<Lesson> lessons = namedJdbcTemplate.query(
                "SELECT * FROM DEP_" + departmentId + ".lesson WHERE topic LIKE :key " +
                        "OR date LIKE :key " +
                        "OR teacher LIKE :key " +
                        "ORDER BY date DESC LIMIT " + ((page - 1) * size) + "," + size , parametrs, new RowMapper<Lesson>() {
                    @Override
                    public Lesson mapRow(ResultSet rs, int rowNum) throws SQLException {
                        return Lesson.builder()
                                .id(rs.getInt("id"))
                                .topic(rs.getString("topic"))
                                .duration(rs.getFloat("duration"))
                                .date(rs.getDate("date"))
                                .teacher(rs.getString("teacher"))
                                .peoplePlanned(rs.getInt("people_planned"))
                                .build();
                    }
                });
        return lessons;
    }
}
