package project.exceptions;


public class Validator {

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

    public static void validatePaginationParams(String pageString, String sizeString) {
        try {
            int page = Integer.parseInt(pageString);
            int size = Integer.parseInt(sizeString);
            if (page < 1 || size < 1) {
                throw new PaginationException("Неправильные параметры page/size в параметрах URL запроса. " +
                        "page/size должны быть больше 1");
            }
        } catch (NumberFormatException e) {
            throw new PaginationException("Неправильные параметры page/size в параметрах URL запроса. " +
                    "Переданы параметры" + pageString + " ," + sizeString);
        }
    }

    public static void validateInterval(int interval) {
        if (interval > 4 || interval < 1) {
            throw new InvalidIntervalException(interval);
        }
    }
}
