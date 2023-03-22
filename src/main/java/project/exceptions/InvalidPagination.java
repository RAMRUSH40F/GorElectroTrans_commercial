package project.exceptions;

public class InvalidPagination extends  RuntimeException{
    public InvalidPagination() {
        super();
    }

    public InvalidPagination(String message) {
        super(message);
    }

    public InvalidPagination(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidPagination(Throwable cause) {
        super(cause);
    }
}
