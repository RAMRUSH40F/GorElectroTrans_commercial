package project.repository;


import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import project.model.Subdepartment;

import java.util.Optional;

@Repository
public interface SubdepartmentJpaRepository extends CrudRepository<Subdepartment, Short> {

    Optional<Subdepartment> findByName(@NonNull String name);

    @Modifying
    @Query("update Subdepartment s set s.name = ?1 where s.id = ?2")
    int updateNameByName(@NonNull String name, @NonNull short id);
}
