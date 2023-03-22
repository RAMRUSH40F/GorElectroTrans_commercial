package project.exceptions;

public class PaginationException extends RuntimeException {
    private final Object receivedId;
    private final String messageTemplate = "Ошибка при получении данных новой страницы. ";

    public PaginationException(Object receivedId) {
        this.receivedId = receivedId;
    }

    @Override
    public String getMessage() {
        return messageTemplate + receivedId;
    }
}
