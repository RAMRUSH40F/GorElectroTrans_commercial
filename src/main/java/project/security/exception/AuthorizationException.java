package project.security.exception;

public class AuthorizationException extends RuntimeException {
    private final String DEFAULT_MESSAGE = "Произошла ошибка авторизации. Скорее всего, у вас нет прав для доступа к этой операции";
    private String customMessage;


    public AuthorizationException(String customMessage) {
        this.customMessage = customMessage;
    }

    public AuthorizationException(Throwable cause) {
        super(cause);
    }

    public AuthorizationException(Throwable cause, String customMessage) {
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
