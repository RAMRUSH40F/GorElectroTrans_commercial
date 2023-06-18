package project.exceptions;

public class InvalidSubdepartmentException extends RuntimeException {
    private final Object receivedSubdepartment;
    private final String MESSAGE_TEMPLATE = "Ошибка с обработкой отдела. Возможно, введенный вами отдел не существует." +
            "Перепроверьте правильность вводимых данных: ";
    private String customMessage;

    public InvalidSubdepartmentException(String receivedSubdepartment, String customMessage) {
        this.receivedSubdepartment = receivedSubdepartment;
        this.customMessage = customMessage;
    }

    public InvalidSubdepartmentException(String receivedSubdepartment) {
        this.receivedSubdepartment = receivedSubdepartment;
    }

    @Override
    public String getMessage() {
        if (customMessage == null) {
            return MESSAGE_TEMPLATE + receivedSubdepartment;
        }
        return customMessage;
    }
}
