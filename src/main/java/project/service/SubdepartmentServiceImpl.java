package project.service;

import lombok.RequiredArgsConstructor;
import project.model.Subdepartment;
import project.repository.SubdepartmentJpaRepository;

import java.util.Map;

//@Service not in use at the moment
@RequiredArgsConstructor
public class SubdepartmentServiceImpl {

    private final Map<Short, SubdepartmentJpaRepository> subdepartmentRepositoryMap;

    public Iterable<Subdepartment> getAll(short department){
        SubdepartmentJpaRepository repository = subdepartmentRepositoryMap.get(department);
        return repository.findAll();

    }
}
