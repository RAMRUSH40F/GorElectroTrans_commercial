package project.repository.multiplier;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
        subDepartmentNames.put(1, "Водители");
        subDepartmentNames.put(2, "Монтажники");
        subDepartmentNames.put(3, "Электрики");
        subDepartmentNames.put(4, "Слесари");
        subDepartmentNames.put(5, "Служба материально-технического снабжения");
        subDepartmentNames.put(6, "Служба подвижного состава");

        for (int i = 1; i <= 15; i++) {
            for (int j = 1; j <= 6; j++) {
                short id = (short) (j * 100 + i);
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
