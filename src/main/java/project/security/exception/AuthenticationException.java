package project.security.exception;


public class AuthenticationException extends RuntimeException {
    private final String DEFAULT_MESSAGE = "Произошла ошибка";
    private String customMessage;


    public AuthenticationException(String customMessage) {
        this.customMessage = customMessage;
    }

    public AuthenticationException(Throwable cause) {
        super(cause);
    }

    public AuthenticationException(Throwable cause, String customMessage) {
        super(cause);
        this.customMessage = customMessage;
    }

    @Override
    public String getMessage() {
        if (customMessage != null) {
            return customMessage;
        }
        return DEFAULT_MESSAGE;
    }
}

