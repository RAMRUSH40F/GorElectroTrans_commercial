package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.LessonContent;
import project.repository.mapper.LessonContentMapper;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class LessonContentRepository implements CRUD<LessonContent> {

    private final NamedParameterJdbcTemplate template;
    private final LessonContentMapper mapper = new LessonContentMapper();

    @Override
    public LessonContent getById(Integer lessonId, Integer departmentId) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("departmentId", departmentId);
        parameters.addValue("lessonId", lessonId);
        try {
            String SQL_GET_BY_ID = "SELECT * FROM DEP_:departmentId .lesson_content WHERE lesson_id = :lessonId";
            return template.queryForObject(SQL_GET_BY_ID, parameters, mapper);
        } catch (EmptyResultDataAccessException e) {
            return new LessonContent();
        }
    }

    @Override
    public List<LessonContent> getAll(Integer departmentId) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("departmentId", departmentId);
        String SQL_GET_ALL = "SELECT * FROM DEP_:departmentId .lesson_content";
        return template.query(SQL_GET_ALL, parameters, mapper);
    }

    @Override
    public boolean create(LessonContent content, Integer departmentId) {
        LessonContent fromDB = getById(content.getLessonId(), departmentId);
        if (LessonContent.isEmpty(fromDB)) {
            return false;
        }
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("departmentId", departmentId);
        parameters.addValue("file", content.getFile());
        parameters.addValue("lessonId", content.getLessonId());
        try {
            String SQL_CREATE = "INSERT INTO DEP_:departmentId .lesson_content (file, lesson_id) VALUES(:file, :lessonId)";
            return template.update(SQL_CREATE, parameters) == 1;
        } catch (DataAccessException e) {
            return false;
        }
    }

    @Override
    public boolean deleteById(Integer lessonId, Integer departmentId) {
        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("lessonId", lessonId)
                .addValue("departmentId", departmentId);
        try {
            String SQL_DELETE_BY_ID = "DELETE FROM DEP_:departmentId .lesson_content WHERE lesson_id = :lessonId";
            return template.update(
                    SQL_DELETE_BY_ID,
                    parameters
            ) == 1;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }

    }
}
