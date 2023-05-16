package repository;

import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import project.model.StudentView;
import project.repository.StudentRepositoryImpl;
import project.repository.SubdepartmentRepository;
import project.service.WorkerService;

import static org.mockito.Mockito.when;

@SpringJUnitConfig
@ExtendWith(MockitoExtension.class)
@ContextConfiguration(classes = StudentRepositoryConfiguration.class)
public class StudentRepositoryImpleUnitTest {

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @MockBean
    private SubdepartmentRepository subdepartmentRepository;

    @MockBean
    private WorkerService workerService;

    @Autowired
    StudentRepositoryImpl studentRepository;


    @Test
    public void StudentRepositoryUnitTest_getByIdReturnIdWhenExists() {

        StudentView studentView = studentRepository.getStudentById(1,"00001");

        Assertions.assertNotNull(studentView);
    }


    @Test
    public void testMocking() {
        when(studentRepository.getStudentById(1, "faf")).thenReturn(null);

        StudentView studentView = studentRepository.getStudentById(1, "00001");

        Assert.assertEquals(null, studentView);
        Mockito.verify(studentRepository).getStudentById(1, "00001");
    }
}
