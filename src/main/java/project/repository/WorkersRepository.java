package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.exceptions.Validator;
import project.model.Worker;
import project.repository.mapper.WorkerMapper;

import java.util.HashMap;
import java.util.Map;

@Repository("WorkersRepositoryBean")
@RequiredArgsConstructor
public class WorkersRepository {
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final WorkerMapper mapper = new WorkerMapper();

    public void addNewWorker(Worker worker) {
        Validator.validateStudentId(worker.getId());
        Map<String, Object> workerData = new HashMap<>();
        workerData.put("id", worker.getId());
        workerData.put("name", worker.getName());
        String INSERT_WORKER_TEMPLATE =
                "INSERT INTO WORKERS.workers(id,name) VALUES(:id,:name) ON DUPLICATE KEY UPDATE name = VALUES(name)";

        namedParameterJdbcTemplate.update(INSERT_WORKER_TEMPLATE, workerData);

    }

    /**
     * @return null if Worker does not exi
     */
    public Worker getWorkerById(String workerId) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("workerId", workerId);

        String SQL_GET_BY_ID = "SELECT * FROM WORKERS.workers WHERE id = :workerId";
        Worker worker;
        try {
            worker = namedParameterJdbcTemplate.query(SQL_GET_BY_ID, parameters, mapper).get(0);
        } catch (IndexOutOfBoundsException e) {
            return null;

        }
        return worker;


    }

}
