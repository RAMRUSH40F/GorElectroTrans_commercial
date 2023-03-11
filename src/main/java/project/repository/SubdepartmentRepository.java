package project.repository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Subdepartment;

import java.util.HashMap;
import java.util.Map;

@Repository(value = "SubdepartmentRepositoryBean")
public class SubdepartmentRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

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
        return jdbcTemplate.queryForObject(query, Subdepartment.class);

    }
}
