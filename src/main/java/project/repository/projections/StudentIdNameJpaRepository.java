package project.repository.projections;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import project.model.projection.StudentIdName;

import java.util.List;

@Repository
public interface StudentIdNameJpaRepository extends PagingAndSortingRepository<StudentIdName, String> {

    /**
     * Найти студентов по фамилии
     * [INFO] Используется индекс на student.name. Данные в name начинаются с фамилии
     */
    List<StudentIdName> findByNameStartsWith(@NonNull String name, @NonNull Pageable pageable);

    /**
     * Найти студентов по вхождении key в поле name в любом регистре.
     * [WARN] Не используется индекс на student.name, потому что запрос вида like %name%
     */
    List<StudentIdName> findByNameContainingIgnoreCase(@NonNull String key, @NonNull Pageable pageable);
}
