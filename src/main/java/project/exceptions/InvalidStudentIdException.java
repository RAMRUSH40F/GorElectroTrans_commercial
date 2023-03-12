package project.exceptions;

public class InvalidStudentIdException extends RuntimeException{
    public InvalidStudentIdException() {
    }

    public InvalidStudentIdException(String message) {
        super(message);
    }

    public InvalidStudentIdException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidStudentIdException(Throwable cause) {
        super(cause);
    }

    public InvalidStudentIdException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
