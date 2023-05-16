package project.repository;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import project.model.Student;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

//@ExtendWith(SpringExtension.class)
//@ExtendWith(MockitoExtension.class)
@SpringBootTest
class StudentRepositoryImplTest {

    @Autowired
    StudentRepository studentRepository;

    @MockBean
    JdbcTemplate jdbcTemplate;

    @Test
    void getStudentsIdList() {
        when(jdbcTemplate.query(anyString(), eq(new RowMapper<Student>() {
            @Override
            public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
                return Student.builder()
                        .studentId(rs.getString("student_Id"))
                        .build();
            }
        }))).thenReturn(new ArrayList<Student>());

        List<Student> result = studentRepository.getStudentsIdList(1);

        Assertions.assertAll(
                () -> Assertions.assertNotNull(studentRepository),
                () -> Assertions.assertEquals(new ArrayList<Student>(), result)
        );
    }
}