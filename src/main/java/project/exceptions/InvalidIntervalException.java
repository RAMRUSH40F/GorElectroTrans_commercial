package project.exceptions;

public class InvalidIntervalException extends RuntimeException {
    private final Object recievedInterval;
    String message="Неверное значение квартала, квартал может принимать значения от 1 до 4, вы ввели: ";
    public InvalidIntervalException(Object recievedInterval){
        this.recievedInterval=recievedInterval;
    }
    @Override
    public String getMessage(){
        return  message+recievedInterval;
    }

}
