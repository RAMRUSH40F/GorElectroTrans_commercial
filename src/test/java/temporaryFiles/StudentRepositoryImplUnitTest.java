package temporaryFiles;

import org.junit.Assert;
import org.junit.Test;
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
import project.service.SubdepartmentServiceImpl;
import project.service.WorkerService;

import java.util.List;

import static org.mockito.Mockito.when;

@SpringJUnitConfig
@ExtendWith(MockitoExtension.class)
@ContextConfiguration(classes = StudentRepositoryConfiguration.class)
public class StudentRepositoryImplUnitTest {

    @MockBean
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @MockBean
    private SubdepartmentServiceImpl service;

    @MockBean
    private WorkerService workerService;

    @Autowired
    StudentRepositoryImpl studentRepository;


    @Test
    public void testMocking() {
        when(studentRepository.getStudentsView(1, 1, 1)).thenReturn(null);

        List<StudentView> result = studentRepository.getStudentsView(1, 1, 1);

        Assert.assertEquals(null, result);
        Mockito.verify(studentRepository).getStudentsView(1, 1, 1);
    }
}
