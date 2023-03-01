package project.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.model.Worker;

import java.util.HashMap;
import java.util.Map;

@Repository
public class WorkersRepository {
@Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate;
 public void addNewWorker(Worker worker){
     if(worker.getId().length>5)
         throw new IndexOutOfBoundsException("Too many symbols in ID!!");
     for (char x:worker.getId()
          ) {
         if(x<48||x>57) // Смотрим кодировку сиволов id
             throw new RuntimeException("Incorrect id symbol!!!!");
     }
     Map<String,Object> workerData=new HashMap<>();
     workerData.put("id", worker.getId());
     workerData.put("name",worker.getName());
     namedParameterJdbcTemplate.update("INSERT INTO WORKERS(id,name)"
             +"VALUES(:id,:name)",workerData);

 }

}
