package project.repository.multiplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.model.Subdepartment;
import project.repository.SubdepartmentRepository;

import java.util.HashMap;
import java.util.Map;

@Service("SubDepartmentBean")
public class SubDepartmentMultiplier {

    @Autowired
    SubdepartmentRepository subdepartmentRepository;

public void addSubDepartments(){
    Map<Integer,String>subDepartmentNames=new HashMap<>();
    subDepartmentNames.put(1,"Жаровня");
    subDepartmentNames.put(2,"Коптильня");
    subDepartmentNames.put(3,"Колотильня");
    subDepartmentNames.put(4,"Наковальня");
    subDepartmentNames.put(5,"Жерновальня");
    subDepartmentNames.put(6,"Молотильня");

    for(int i=1;i<=15;i++) {
        for(int j =1;j<=6;j++) {
            short id = (short)(j*100+i);
            String name = subDepartmentNames.get(j);
            name=name+"_"+i;
            Subdepartment subdepartment = Subdepartment.builder()
                    .name(name)
                    .id(id)
                    .build();
            subdepartmentRepository.addNewSubdepartment(i, subdepartment);
        }
    }
    System.out.println("Script ended its work!");

}
}
