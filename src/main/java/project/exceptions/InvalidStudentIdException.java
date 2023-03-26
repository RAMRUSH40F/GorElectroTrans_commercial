package project.exceptions;

public class InvalidStudentIdException extends RuntimeException {

    private final Object receivedId;
    private final String MESSAGE_TEMPLATE = "Вы ввели неправильны id обучающегося." +
            " id - набор из 5 цифр 00000-99999. Вы ввели: ";
    private String customMessage;

    public InvalidStudentIdException(String receivedId, String customMessage) {
        this.receivedId = receivedId;
        this.customMessage = customMessage;
    }

    public InvalidStudentIdException(String receivedId) {
        this.receivedId = receivedId;
    }

    @Override
    public String getMessage() {
        if (customMessage == null) {
            return MESSAGE_TEMPLATE + receivedId;
        }
        return customMessage;
    }
}
