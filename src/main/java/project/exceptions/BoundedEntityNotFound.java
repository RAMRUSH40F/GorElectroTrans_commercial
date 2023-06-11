package project.exceptions;

import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;

public class BoundedEntityNotFound extends RuntimeException {
    private String customMessage;

    public BoundedEntityNotFound(JpaObjectRetrievalFailureException e) {
        String exceptionMessage = e.getMessage();
        if (exceptionMessage.contains("Lesson")) {
            customMessage = "Урока с таким номером нет в базе.";
        } else if (exceptionMessage.contains("Student")) {
            customMessage = "Рабочего с таким номером нет в базе.";
        }

    }

    public String getCustomMessage() {
        return customMessage;
    }

}
