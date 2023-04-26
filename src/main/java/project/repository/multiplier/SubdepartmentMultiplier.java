package project.repository.multiplier;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.model.Subdepartment;
import project.repository.SubdepartmentRepository;

import java.util.HashMap;
import java.util.Map;

@Service("SubdepartmentMultiplierBean")
@RequiredArgsConstructor
public class SubdepartmentMultiplier {

    private final SubdepartmentRepository subdepartmentRepository;

    public void addAllSubDepartments() {
        Map<Integer, String> subDepartmentNames = new HashMap<>();
        subDepartmentNames.put(1, "Водители троллейбусов");
        subDepartmentNames.put(2, "Машинисты трамваев");
        subDepartmentNames.put(3, "Монтажники");
        subDepartmentNames.put(4, "Электрики");
        subDepartmentNames.put(5, "Слесари");
        subDepartmentNames.put(6, "Служба материально-технического снабжения");
        subDepartmentNames.put(7, "Служба подвижного состава");

        for (int i = 1; i <= 15; i++) {
            for (int j = 1; j <= 7; j++) {
                short id = (short) (j);
                String name = subDepartmentNames.get(j);
                name = name + "_" + i;
                Subdepartment subdepartment = Subdepartment.builder()
                        .name(name)
                        .id(id)
                        .build();
                subdepartmentRepository.addNewSubdepartment(i, subdepartment);
            }
        }
        System.out.println("SubdepartmentMultiplier ended its work!");

    }
}
