package project.repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import project.model.Subdepartment;

@Repository
public interface SubdepartmentJpaRepository extends CrudRepository<Subdepartment, Short> {
}
