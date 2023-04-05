package project.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntervalModel {
    private int year;
    private int itnterval;

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getItnterval() {
        return itnterval;
    }

    public void setItnterval(int itnterval) {
        this.itnterval = itnterval;
    }
}
