package project.exceptions;

public class FileSizeLimitExceededException extends RuntimeException {
    private final String MESSAGE_TEMPLATE = "Файл превысил максимально допустимый лимит в 14МБ. " +
            "Попробуйте загрузить в виде нескольких файлов, или добавить файл к архиву.";
    private String customMessage;

    public FileSizeLimitExceededException(String customMessage) {
        this.customMessage = customMessage;
    }

    public FileSizeLimitExceededException() {
    }


    @Override
    public String getMessage() {
        if (customMessage == null) {
            return MESSAGE_TEMPLATE;
        }
        return customMessage;
    }
}
