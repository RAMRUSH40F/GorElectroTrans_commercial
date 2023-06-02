package project.security.repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project.security.model.User;

@Repository
public interface UserJpaRepository extends CrudRepository<User, String> {
}
