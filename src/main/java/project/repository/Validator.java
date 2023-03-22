package project.repository;

import project.exceptions.InvalidDepartmentException;

public class Validator {

    public static void validateDepartmentId(Integer id){
        if (id > 15 || id < 1) {
            throw new InvalidDepartmentException("Invalid department id, it has to be in [1,15] interval");
        }
    }
}
