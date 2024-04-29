package project.repository.multiplier;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import project.model.Subdepartment;
import project.service.SubdepartmentServiceImpl;

import java.util.HashMap;
import java.util.Map;

@Service
@Lazy
@RequiredArgsConstructor
@Slf4j
public class SubdepartmentMultiplier {

    private static final Map<Integer, String> SUBDEPARTMENT_NAMES = new HashMap<>();
    static {
        SUBDEPARTMENT_NAMES.put(1, "Водители троллейбусов");
        SUBDEPARTMENT_NAMES.put(2, "Машинисты трамваев");
        SUBDEPARTMENT_NAMES.put(3, "Монтажники");
        SUBDEPARTMENT_NAMES.put(4, "Электрики");
        SUBDEPARTMENT_NAMES.put(5, "Слесари");
        SUBDEPARTMENT_NAMES.put(6, "Служба материально-технического снабжения");
        SUBDEPARTMENT_NAMES.put(7, "Служба подвижного состава");
    }

    private final SubdepartmentServiceImpl service;

    public void addAllSubDepartments() {

        for (int i = 1; i <= 15; i++) {
            for (int j = 1; j <= SUBDEPARTMENT_NAMES.size(); j++) {
                short id = (short) (j);
                String name = SUBDEPARTMENT_NAMES.get(j);
                Subdepartment subdepartment = Subdepartment.builder()
                        .name(name)
                        .id(id)
                        .build();
                service.save(i, subdepartment);
            }
        }
        log.info("Added subdepartment testdata for all departments");
    }
}
