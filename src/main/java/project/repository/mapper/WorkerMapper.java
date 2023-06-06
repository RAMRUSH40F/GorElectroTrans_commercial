package project.repository.mapper;

import org.springframework.jdbc.core.RowMapper;
import project.model.Worker;

import java.sql.ResultSet;
import java.sql.SQLException;

@Deprecated
public class WorkerMapper implements RowMapper<Worker> {
    @Override
    public Worker mapRow(ResultSet rs, int rowNum) throws SQLException {
        return Worker.builder()
                .id(rs.getString("id"))
                .name(rs.getString("name"))
                .build();
    }
}

