package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import project.model.Attendance;
import project.model.AttendanceId;
import project.repository.AttendanceJpaRepository;

import java.util.List;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceJpaRepository repository;

    // TODO: make repository.save(attendance) return all object
    public Attendance save(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);

        repository.save(attendance);
        Attendance attendance1 = repository.findById(new AttendanceId(attendance.getLessonId(), attendance.getStudentId())).orElse(null);
        System.out.println(attendance1);
        return attendance1;
    }

    public List<Attendance> findAllPaginated(int departmentId, Integer page, Integer pageSize) {
        setCurrentDataSource("DEP_" + departmentId);
        Pageable sortedByDatePaginatedRequest = PageRequest.of(page - 1, pageSize, Sort.by("lesson_id").ascending());
        return repository.findAll(sortedByDatePaginatedRequest).toList();
    }

    public List<Attendance> getByKeyword(int departmentId, String key) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.getByKey(key, PageRequest.of(1, 20));
    }

    public void updateEntity(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);
        repository.save(attendance);
    }

    public void deleteById(int departmentId, Attendance attendance) {
        setCurrentDataSource("DEP_" + departmentId);
        AttendanceId id = new AttendanceId(attendance.getLessonId(),attendance.getStudentId());
        repository.deleteById(id);
    }

    /**
     * @param departmentId
     * @return how many records are in database
     */
    public Integer getCount(int departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.countAll();
    }


}
