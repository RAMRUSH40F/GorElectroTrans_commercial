package project.exceptions;

public class InvalidDepartmentException extends RuntimeException {
    private final Object receivedId;
    private final String messageTemplate = "Неправильный департамент в ссылке. " +
            "Департаментов всего 15, а вы в качестве департамента ввели: ";

    public InvalidDepartmentException(Object receivedId) {
        this.receivedId = receivedId;
    }

    @Override
    public String getMessage() {
        return messageTemplate+receivedId;
    }

}
