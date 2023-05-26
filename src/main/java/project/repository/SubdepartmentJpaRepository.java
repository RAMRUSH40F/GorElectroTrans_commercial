package project.repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import project.model.Subdepartment;

import java.util.Optional;

@Repository
public interface SubdepartmentJpaRepository extends CrudRepository<Subdepartment, Short> {

    Optional<Subdepartment> findByName(@NonNull String name);
}
