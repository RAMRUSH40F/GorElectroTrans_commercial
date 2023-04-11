package project.exceptions;



public class AuthenticationException extends RuntimeException {
    private final String DEFAULT_MESSAGE = "Произошла ошибка";
    private String customMessage;


    public AuthenticationException(String customMessage) {
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

