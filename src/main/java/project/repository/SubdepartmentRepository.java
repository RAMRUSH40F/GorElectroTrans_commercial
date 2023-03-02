package project.repository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Subdepartment;

import java.util.HashMap;
import java.util.Map;

@Repository
public class SubdepartmentRepository {
    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public void addNewSubdepartment(int departmentId, Subdepartment subdepartment){
        Map<String, Object> subdepartmentData=new HashMap<>();
        subdepartmentData.put("id", subdepartment.getId());
        subdepartmentData.put("name",subdepartment.getName());
        namedParameterJdbcTemplate.update("INSERT INTO DEP_"+departmentId+".subdepartment(id,name)"
                +"VALUES(:id,:name)",subdepartmentData);


    }
}
