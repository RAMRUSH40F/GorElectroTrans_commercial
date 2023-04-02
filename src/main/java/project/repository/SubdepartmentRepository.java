package project.repository;


import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Attendance;
import project.model.Subdepartment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository(value = "SubdepartmentRepositoryBean")
@RequiredArgsConstructor
public class SubdepartmentRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public void addNewSubdepartment(int departmentId, Subdepartment subdepartment) {
        Map<String, Object> subdepartmentData = new HashMap<>();
        subdepartmentData.put("id", subdepartment.getId());
        subdepartmentData.put("name", subdepartment.getName());
        namedParameterJdbcTemplate.update("INSERT INTO DEP_" + departmentId + ".subdepartment(id,name)"
                + "VALUES(:id,:name)", subdepartmentData);
    }

    public Subdepartment getSubdepartmentByName(int departmentId, String subDepartment_name) {
        String query = new StringBuilder()
                .append("SELECT id,name FROM DEP_")
                .append(departmentId)
                .append(".subdepartment ")
                .append("WHERE name='")
                .append(subDepartment_name)
                .append("'")
                .toString();
        List<Subdepartment> resultList = jdbcTemplate.query(query, (rs, rowNum) ->
                Subdepartment.builder()
                        .name(rs.getString("name"))
                        .id(rs.getShort("id"))
                        .build());
        if (resultList.size() == 0) return null;
        return resultList.get(0);

    }

    public List<Subdepartment> getAll(Integer departmentId) {
        String query = new StringBuilder()
                .append("SELECT id, name, name FROM DEP_")
                .append(departmentId)
                .append(".subdepartment")
                .toString();
        return jdbcTemplate.query(query, (rs, rowNum) ->
                Subdepartment.builder()
                        .id(rs.getShort("id"))
                        .name(rs.getString("name"))
                        .build());
    }
    public void updateRecordSubdepartmentById(int departmentId, Subdepartment subdepartment) {
        Map<String, Object> requestParams = new HashMap<>();
        requestParams.put("id", subdepartment.getId());
        requestParams.put("name", subdepartment.getName());
        String SQL_UPDATE_TEMPLATE = "UPDATE DEP_" + departmentId + ".subdepartment SET id =:id WHERE name=:name";
        namedParameterJdbcTemplate.update(SQL_UPDATE_TEMPLATE, requestParams);
    }

    public void deleteSubdepartmentById(Integer departmentId, short id) {
        Map<String, Object> requestParams = new HashMap<>();
        requestParams.put("id", id);
        String SQL_DELETE_TEMPLATE = "DELETE FROM DEP_" + departmentId + ".subdepartment WHERE id =:id";
        namedParameterJdbcTemplate.update(SQL_DELETE_TEMPLATE, requestParams);
    }

}
