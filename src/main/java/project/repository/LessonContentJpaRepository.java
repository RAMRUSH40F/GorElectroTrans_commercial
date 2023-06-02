package project.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import project.model.LessonContent;
import project.model.Projection.LessonContentInfo;

import java.util.List;

@Repository
public
interface LessonContentJpaRepository extends CrudRepository<LessonContent,String> {
    List<LessonContentInfo> findByLessonId(@NonNull Integer lessonId);


}
