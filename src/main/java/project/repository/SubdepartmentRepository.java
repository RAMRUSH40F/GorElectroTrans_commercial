package project.repository;


import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Subdepartment;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

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
        System.out.println(query);
        List<Subdepartment> resultList = jdbcTemplate.query(query, (rs, rowNum) ->
                Subdepartment.builder()
                        .name(rs.getString("name"))
                        .id(rs.getShort("id"))
                        .build());
        if (resultList.size() == 0) return null;
        return resultList.get(0);

    }
}
