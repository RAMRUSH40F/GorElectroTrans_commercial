package project.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import project.model.Worker;

import java.util.Optional;

@Repository("WorkersRepository")
public interface WorkerJpaRepository extends CrudRepository<Worker, String> {
    Optional<Worker> findById(String id);
}
