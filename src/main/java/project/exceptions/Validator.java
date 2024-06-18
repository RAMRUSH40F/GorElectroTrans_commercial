package project.exceptions;


import java.time.LocalDate;

public class Validator {
    private Validator() {
    }

    public static Integer validateDepartmentId(String id) {
        try {
            Integer depId = Integer.valueOf(id);
            if (depId > 15 || depId < 1) {
                throw new InvalidDepartmentException(id);
            }
            return depId;
        } catch (NumberFormatException e) {
            throw new InvalidDepartmentException(id);
        }


    }

    public static void validateStudentId(String id) {
        if (id.length() != 5) {
            throw new InvalidStudentIdException(id);
        }
    }

    public static void validatePaginationParams(int page, int size) {
        try {
            if (page < 1 || size < 1) {
                throw new PaginationException("Неправильные параметры page/size в параметрах URL запроса. " +
                        "page/size должны быть больше 1");
            }
        } catch (NumberFormatException e) {
            throw new PaginationException("Неправильные параметры page/size в параметрах URL запроса. " +
                    "Переданы параметры" + page + " ," + size);
        }
    }

    public static void validateInterval(int interval) {
        if (interval > 4 || interval < 1) {
            throw new InvalidIntervalException(interval);
        }
    }

    public static void validateDate(LocalDate dateFrom,LocalDate dateTo){
        if(dateFrom.isAfter(dateTo) ){
            throw new IllegalArgumentException("Ошибка ввода диапазона дат");
        }
    }
}
