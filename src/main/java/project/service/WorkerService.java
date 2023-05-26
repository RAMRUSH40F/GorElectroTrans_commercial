package project.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.model.Worker;
import project.repository.WorkerJpaRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkerService{

    private final WorkerJpaRepository workerRepository;

    public void addNewWorker(Worker worker) {
        workerRepository.save(worker);
    }

    /**
     * @return null if Worker does not exist
     */
    public Optional<Worker> getWorkerById(String workerId) {
        return workerRepository.findById(workerId);
    }

}
