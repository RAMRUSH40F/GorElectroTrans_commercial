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
  private final StringBuilder idArray=new StringBuilder();
    public void addOneWorker() {
        Random random=new Random();
for(int i=0;i<5;i++){
    idArray.append(random.nextInt(10));
}

Worker worker = Worker.builder().id(idArray.toString()).name(env.getProperty("name"+(random.nextInt(20)+1))).build();
workersRepository.addNewWorker(worker);
    }



}

