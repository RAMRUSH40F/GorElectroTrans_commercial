package project.exceptions;

public class InvalidStudentIdException extends RuntimeException {

    private final Object receivedId;
    private final String messageTemplate = "Вы ввели неправильны id обучающегося." +
            " id - набор из 5 цифр 00000-99999. Вы ввели: ";

    public InvalidStudentIdException(Object receivedId) {
        this.receivedId = receivedId;
    }

    @Override
    public String getMessage() {
        return messageTemplate + receivedId;
    }
}
