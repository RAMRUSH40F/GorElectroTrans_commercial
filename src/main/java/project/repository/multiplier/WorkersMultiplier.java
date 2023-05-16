package project.repository.multiplier;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.model.Worker;
import project.service.WorkerService;

import java.util.List;
import java.util.Random;

@Service("WorkersMultiplierBean")
@RequiredArgsConstructor
public class WorkersMultiplier {

    private final WorkerService workerService;
    List<String> workerRandomNameList = List.of("Стремглав Вячеслав Игоревич", "Семен Иванович Дмитриевич", "Треуголова София Дмитриевна", "Рябичев Даниил Алексендрович", "Теска Кирилл Дмитриевич", "Трезубец Арина Дмитриевич", "Талец Данир Игоревич", "Иванов Семен Алексендрович", "Тодоренко Регина Алексендровна", "Бактяп Иван Алексендрович", "Ильюшина Мария Алексендровна", "Звонкович Николай Игоревич", "Жданович Артем Дмитриевич", "Скряпкин Сергей Алексендрович", "Карцева Катя Игоревна", "Трошин Никита Алексендрович", "Астон Михаил Дмитриевич", "Кудряшев Михаил Игоревич", "Москов Артем Алексендрович", "Король Артем Дмитриевич");

    public void addAllWorkers() {
        StringBuilder idBuilder = new StringBuilder();
        Random random = new Random();

        for (int secondN = 0; secondN < 5; secondN++) {
            for (int thirdN = 0; thirdN < 10; thirdN++) {
                for (int fourthN = 0; fourthN < 10; fourthN++) {
                    for (int fithtN = 0; fithtN < 10; fithtN++) {
                        idBuilder.delete(0, 5);
                        idBuilder.append(0).append(secondN).append(thirdN).append(fourthN).append(fithtN);
                        String workerName = workerRandomNameList.get(random.nextInt(20));
                        Worker worker = Worker.builder()
                                .id(idBuilder.toString())
                                .name(workerName)
                                .build();
                        workerService.addNewWorker(worker);
                    }
                }
            }
        }

    }


}

