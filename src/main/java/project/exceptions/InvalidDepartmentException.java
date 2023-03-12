package project.exceptions;

public class InvalidDepartmentException extends RuntimeException{
    public InvalidDepartmentException() {
    }

    public InvalidDepartmentException(String message) {
        super(message);
    }

    public InvalidDepartmentException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidDepartmentException(Throwable cause) {
        super(cause);
    }

    public InvalidDepartmentException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
