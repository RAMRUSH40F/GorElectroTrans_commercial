package project.authentication.repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project.authentication.model.User;

@Repository
public interface UserJpaRepository extends CrudRepository<User, String> {
}
