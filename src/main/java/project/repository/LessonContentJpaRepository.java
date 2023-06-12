package project.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import project.model.LessonContent;

@Repository
public
interface LessonContentJpaRepository extends CrudRepository<LessonContent,String> {



}
