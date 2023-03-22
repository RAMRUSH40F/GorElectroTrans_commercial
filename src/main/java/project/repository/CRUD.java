package project.repository;

import java.util.List;

public interface CRUD<T> {

    boolean create(T t, Integer departmentId);

    T getById(Integer id, Integer departmentId);

    List<T> getAll(Integer departmentId);

    boolean deleteById(Integer id, Integer departmentId);

}
