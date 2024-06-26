package project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import project.model.Subdepartment;
import project.repository.SubdepartmentJpaRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static project.dataSource.DynamicDataSourceContextHolder.getCurrentDataSource;
import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubdepartmentServiceImpl {

    private final SubdepartmentJpaRepository repository;

    public @NonNull List<Subdepartment> findAll(int departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        Iterable<Subdepartment> entities = repository.findAll();
        List<Subdepartment> result = new ArrayList<>();
        entities.forEach(result::add);
        return result;

    }

    public boolean deleteById(int departmentId, short id) {
        try {
            setCurrentDataSource("DEP_" + departmentId);
            repository.deleteById(id);

            return true;
        } catch (EmptyResultDataAccessException e) {
            return false;
        }
    }

    public @NonNull Subdepartment updateName(int departmentId, Subdepartment subdepartment) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.save(subdepartment);
    }

    public @NonNull Subdepartment save(int departmentId, Subdepartment subdepartment) {
        setCurrentDataSource("DEP_" + departmentId);
        log.debug(getCurrentDataSource());
        return repository.save(subdepartment);
    }

    public @NonNull Optional<Subdepartment> findByName(int departmentId, String subdepartmentName) {
        setCurrentDataSource("DEP_" + departmentId);
        return repository.findByName(subdepartmentName);
    }


}
