import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import project.model.StudentView;
import project.repository.StudentRepository;

@RunWith(MockitoJUnitRunner.class)
public class MockIntegrativeTest {

    @Mock
    StudentRepository studentRepository;

    @Test
    public void testMocking() {
        Mockito.when(studentRepository.getStudentById(1,"faf")).thenReturn(null);

        StudentView studentView = studentRepository.getStudentById(1,"00001");

        Assert.assertEquals(null, studentView);
        Mockito.verify(studentRepository).getStudentById(1,"00001");
    }
}
