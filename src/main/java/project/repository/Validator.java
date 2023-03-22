package project.repository;

import project.exceptions.InvalidDepartmentException;
import project.exceptions.InvalidStudentIdException;

public class Validator {

    public static void validateDepartmentId(Integer id){
        if (id > 15 || id < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
    }
    public static void validateStudentId(String id){
        if (id.length() != 5) {
            throw new InvalidStudentIdException();
        }
    }
}
