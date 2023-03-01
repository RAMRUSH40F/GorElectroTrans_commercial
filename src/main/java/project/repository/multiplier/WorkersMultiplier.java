package project.repository.multiplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import project.model.Worker;
import project.repository.WorkersRepository;

import java.util.Random;

@Service("WorkersMultiplierBean")
public class WorkersMultiplier {
    @Autowired
    Environment env;

    @Autowired
    WorkersRepository workersRepository;


    public void addAllWorkers() {
        StringBuilder idBuilder = new StringBuilder();
        Random random = new Random();

        for (int secondN = 0; secondN < 5; secondN++) {
            for (int thirdN = 0; thirdN < 10; thirdN++) {
                for (int fourthN = 0; fourthN < 10; fourthN++) {
                    for (int fithtN = 0; fithtN < 10; fithtN++) {
                        idBuilder.delete(0, 5);
                        idBuilder.append(0).append(secondN).append(thirdN).append(fourthN).append(fithtN);

                        Worker worker = Worker.builder()
                                .id(idBuilder.toString())
                                .name(env.getProperty("name" + (random.nextInt(20) + 1)))
                                .build();
                        workersRepository.addNewWorker(worker);
                    }
                }
            }
        }

    }


}

