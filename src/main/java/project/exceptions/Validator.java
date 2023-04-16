package project.exceptions;


import project.security.model.User;

public class Validator {

    public static void validateDepartmentId(Integer id) {
        if (id > 15 || id < 1) {
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

    public static void validateAuth(User user, int departmentID) {
        if (!user.getAuthorities().contains(String.valueOf(departmentID).intern())) {
            throw new AuthenticationException("У пользователя нет доступа к данной информации.");
        }
    }

    public static void validateInterval(int interval) {
        if (interval > 4 || interval < 1) {
            throw new InvalidIntervalException(interval);
        }
    }
}
