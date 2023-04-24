package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.LessonContent;
import project.repository.mapper.LessonContentInfoMapper;

import java.util.List;
import java.util.NoSuchElementException;

import static project.exceptions.Validator.validateDepartmentId;

@Repository
@RequiredArgsConstructor
public class LessonContentRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final JdbcTemplate jdbcTemplate;
    private final LessonContentInfoMapper mapper = new LessonContentInfoMapper();

    public byte[] getFileByName(String fileName, Integer departmentId) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("departmentId", departmentId);
        parameters.addValue("fileName", fileName);
        try {
            String SQL_GET_BY_ID = "SELECT file FROM DEP_:departmentId .lesson_content WHERE file_name = :fileName";
            return namedParameterJdbcTemplate.queryForObject(SQL_GET_BY_ID, parameters, byte[].class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<LessonContent> getAllContentInfoPaged(int department, int page, int size) {
        String sqlQuery = "SELECT * FROM DEP_" + department + ".Materials_view" +
                " ORDER BY date DESC LIMIT " + ((page - 1) * size) + "," + size;
        return namedParameterJdbcTemplate.query(sqlQuery, mapper);

    }

    public List<String> getFileNamesByLessonId(int department, int id) {
        return namedParameterJdbcTemplate.query(
                "SELECT file_name FROM DEP_" + department + ".lesson_content WHERE lesson_id=" + id,
                (rs, rowNum) -> rs.getString("file_name"));

    }

    public LessonContent getContentInfoByFileName(int department, String fileName) {
        String sqlQuery = "SELECT * FROM DEP_" + department + ".Materials_view" +
                " WHERE file_name='" + fileName + "' ORDER BY date DESC";
        try {
            return namedParameterJdbcTemplate.query(sqlQuery, mapper).get(0);
        } catch (IndexOutOfBoundsException e) {
            throw new NoSuchElementException("Такого файла в базе нет");
        }


    }

    public boolean create(LessonContent content, Integer departmentId) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("departmentId", departmentId);
        parameters.addValue("file_name", content.getFileName());
        parameters.addValue("lessonId", content.getLessonId());
        parameters.addValue("file", content.getFile());
        try {
            String SQL_CREATE = "INSERT INTO DEP_:departmentId .lesson_content (file_name,file, lesson_id) VALUES(:file_name,:file, :lessonId)";
            return namedParameterJdbcTemplate.update(SQL_CREATE, parameters) == 1;
        } catch (DataAccessException e) {
            return false;
        }
    }


    public boolean deleteFileByName(Integer departmentId, String fileName) {
        MapSqlParameterSource parameters = new MapSqlParameterSource()
                .addValue("departmentId", departmentId)
                .addValue("fileName", fileName);
        try {
            String SQL_DELETE_BY_ID = "DELETE FROM DEP_:departmentId .lesson_content WHERE file_name = :fileName";
            return namedParameterJdbcTemplate.update(
                    SQL_DELETE_BY_ID,
                    parameters
            ) == 1;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }

    }

    public Integer getLessonContentCount(Integer departmentId) {
        String databaseName = "DEP_" + departmentId;
        return jdbcTemplate.queryForObject("SELECT COUNT(file_name) FROM " +
                databaseName + ".lesson_content AS COUNT", Integer.class);
    }

}
