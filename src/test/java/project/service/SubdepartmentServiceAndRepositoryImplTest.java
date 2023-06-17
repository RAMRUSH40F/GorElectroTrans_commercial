package project.service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import project.dataSource.DynamicDataSourceContextHolder;
import project.model.Subdepartment;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

@SpringBootTest
class SubdepartmentServiceAndRepositoryImplTest {

    @Autowired
    SubdepartmentServiceImpl service;

    @Test
    void findAll_returnNotNull() {
        int departmentId = 1;
        List<Subdepartment> result = service.findAll(departmentId);

        Assertions.assertAll(
                () -> assertEquals(("DEP_" + departmentId).intern(), DynamicDataSourceContextHolder.getCurrentDataSource()),
                () -> Assertions.assertNotNull(result)
        );
    }


    //Тест пока валится потому что при инициализации проблема с datasource
    @Test
    void deleteById_NotThrowsOnNotExistingId() {
        int departmentId = 2;

        short notExistingId = 222;

        boolean result = service.deleteById(departmentId, notExistingId);

        Assertions.assertAll(
                () -> assertEquals(("DEP_" + departmentId).intern(), DynamicDataSourceContextHolder.getCurrentDataSource()),
//                () -> assertDoesNotThrow(() -> service.deleteById(departmentId, notExistingId)),
                () -> assertFalse(result)
        );
    }

    @Test
    void deleteById_notThrowsOnExistingId() {

        short departmentId = 3;
        Subdepartment subdepartment = getNotExistingSubdepartment();
        service.save(departmentId, subdepartment);
        short existingId = subdepartment.getId();


        Assertions.assertAll(
                () -> service.deleteById(departmentId, existingId),
                () -> assertEquals(("DEP_" + departmentId).intern(), DynamicDataSourceContextHolder.getCurrentDataSource())
        );
    }

    @Test
    @Transactional
    void updateName_correctlySaved() {

        short existingId = 5;
        short departmentId = 4;
        Subdepartment subdepartment = getNotExistingSubdepartment();
        service.save(departmentId, subdepartment);


        String newName = "fff";
        subdepartment.setName(newName);
        service.updateName(departmentId, subdepartment);

        Subdepartment result = service.findById(departmentId, subdepartment.getId()).get();

        Assertions.assertAll(
                () -> assertEquals(new Subdepartment(subdepartment.getId(), subdepartment.getName()),
                        result),
                () -> service.deleteById(departmentId, existingId),
                () -> assertEquals(("DEP_" + departmentId).intern(), DynamicDataSourceContextHolder.getCurrentDataSource())
        );
    }

    @Test
    void save_doubleSaveNotThrows() {
        short existingId = 5;
        short departmentId = 5;
        service.save(departmentId, getNotExistingSubdepartment());
        service.save(departmentId, getNotExistingSubdepartment());


        Assertions.assertAll(
                () -> service.deleteById(departmentId, existingId),
                () -> assertEquals(("DEP_" + departmentId).intern(), DynamicDataSourceContextHolder.getCurrentDataSource())
        );
    }

    @Test
    void getById() {
    }

    @Test
    void getByName() {
    }

    private static Subdepartment getNotExistingSubdepartment() {
        return new Subdepartment((short) 220, "TestSubDep");
    }
}