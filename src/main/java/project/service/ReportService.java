package project.service;

import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Year;
import java.util.AbstractMap;
import java.util.Iterator;
import java.util.Map;

@Repository("ReportServiceBean")
@RequiredArgsConstructor
public class ReportService {
    private final JdbcTemplate jdbcTemplate;

    public HSSFWorkbook readWorkbook(String filename){
        try {
            return new HSSFWorkbook(new POIFSFileSystem(new FileInputStream(filename)));
        } catch (IOException e) {
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы", e);
        }
    }

    public void writeWorkbook(HSSFWorkbook wb, String fileName) {
        try {
            FileOutputStream fileOut = new FileOutputStream(fileName);
            wb.write(fileOut);
            fileOut.close();
        } catch (IOException e) {
            throw new RuntimeException(
                    "Произошла другая ошибка связанная с записью в таблицу", e);
        }
    }

    public void formLessonReport(HSSFWorkbook wb, String fileName, int quarter) {
        final HSSFSheet sheet = wb.getSheet("Лист1");
        final HSSFRow row1 = sheet.getRow(2);
        final HSSFRow row2 = sheet.getRow(3);
        final int lastCell = 31;
        final Map.Entry<Integer, Integer> yearMonthPair = calculateMonth(quarter);

        formLesson(row1, lastCell, yearMonthPair);

        formHeldLesson(row2, lastCell, yearMonthPair);

        setLastValue(row1);
        setLastValue(row2);
        writeWorkbook(wb, fileName);
    }

    private void formLesson(HSSFRow row1, int lastCell, Map.Entry<Integer, Integer> yearMonthPair) {
        HSSFCell cell1;
        for (int column = 1; column < lastCell; column += 2) {
            cell1 = row1.getCell(column);
            cell1.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (column / 2 + 1)
                            + ".lesson WHERE `date` BETWEEN '"
                            + yearMonthPair.getKey() + "-"
                            + yearMonthPair.getValue()
                            + "-01' AND '"
                            + yearMonthPair.getKey() + "-"
                            + (yearMonthPair.getValue() + 3) + "-01'",
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
    }

    private void formHeldLesson(HSSFRow row2, int lastCell, Map.Entry<Integer, Integer> yearMonthPair) {
        HSSFCell cell;
        for (int column = 1; column < lastCell - 1; column += 2) {
            cell = row2.getCell(column);
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_"
                            + (column / 2 + 1)
                            + ".lesson WHERE `date` BETWEEN '"
                            + yearMonthPair.getKey() + "-0"
                            + yearMonthPair.getValue()
                            + "-01' AND '"
                            + yearMonthPair.getKey() + "-0"
                            + (yearMonthPair.getValue() + 3)
                            + "-01' AND isHeld=true",
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
    }

    private void setLastValue(HSSFRow row) {
        int total = 0;
        Cell cell;
        for (Iterator<Cell> x = row.cellIterator(); x.hasNext(); ) {
            cell = x.next();
            if (cell.getColumnIndex() == 0) {
                continue;
            }
            if (cell.getColumnIndex() == row.getLastCellNum() - 2) {
                cell.setCellValue(total);
            }
            total += cell.getNumericCellValue();
        }
    }


    public void formWorkerReport(HSSFWorkbook wb, String filename) {
        final HSSFSheet sheet = wb.getSheet("Лист1");
        final HSSFRow row = sheet.getRow(7);
        HSSFCell cell;
        int lastCell = 31;
        for (int column = 1; column < lastCell - 1; column += 2) {
            cell = row.getCell(column);
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (column / 2 + 1) + ".student",
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
        formSpecificWorkersReport(WorkerProfessions.VODITELY.getProfession(), sheet.getRow(8));
        formSpecificWorkersReport(WorkerProfessions.SLESARY.getProfession(), sheet.getRow(9));
        setSubstractionValue(sheet.getRow(12), 7, 11, 1, row.getLastCellNum(), sheet);
        setLastValue(row);
        writeWorkbook(wb, filename);
    }

    private void formSpecificWorkersReport(String profession, HSSFRow row) {
        if (profession == null || row == null) {
            return;
        }
        final int lastCell = 31;
        int professionId;
        HSSFCell cell;
        for (int i = 1; i < lastCell; i += 2) {
            cell = row.getCell(i);
            try {
                professionId = jdbcTemplate.query("SELECT id FROM DEP_" + (i / 2 + 1) + ".subdepartment WHERE name LIKE '" + profession + "'",
                        (rs, rowNum) -> rs.getInt("id")).get(0);
            } catch (IndexOutOfBoundsException e) {
                professionId = 0;
                System.out.println("No_One_Found");
            }
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (i / 2 + 1) + ".student WHERE subdepartment_id=" + professionId,
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
        setLastValue(row);
    }

    public void formTeacherReport(HSSFWorkbook wb, String filename, int quarter) {
        final HSSFSheet sheet = wb.getSheet("Лист1");
        final HSSFRow row1 = sheet.getRow(13);
        HSSFCell cell1;
        int lastCell = 31;
        Map.Entry<Integer, Integer> yearMonthPair = calculateMonth(quarter);

        formLesson(row1, lastCell, yearMonthPair);

        formSpecificTeacherReport(TeacherProfession.RUKOVODITEL.getProfession(), sheet.getRow(14), quarter);
        formSpecificTeacherReport(TeacherProfession.MASTER.getProfession(), sheet.getRow(15), quarter);
        formSpecificTeacherReport(TeacherProfession.NASTAVNIK.getProfession(), sheet.getRow(16), quarter);
        setSubstractionValue(sheet.getRow(17), 13, 16, 1, lastCell, sheet);
        setLastValue(row1);

        writeWorkbook(wb, filename);
    }


    private void formSpecificTeacherReport(String profession, HSSFRow row, int quarter) {
        if (profession == null || row == null) {
            return;
        }
        Map.Entry<Integer, Integer> yearMonthPair = calculateMonth(quarter);
        int lastCell = 31;
        HSSFCell cell;
        for (int column = 1; column < lastCell; column += 2) {
            cell = row.getCell(column);
            cell.setCellValue(jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (column / 2 + 1)
                            + ".lesson WHERE `date` BETWEEN '"
                            + yearMonthPair.getKey() + "-"
                            + yearMonthPair.getValue()
                            + "-01' AND '"
                            + yearMonthPair.getKey() + "-"
                            + (yearMonthPair.getValue() + 3)
                            + "-01' AND teacherPost LIKE '"
                            + profession + "'",
                    (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0));
        }
        setLastValue(row);
    }

    public void setSubstractionValue(HSSFRow destination, int from, int to, int firstCell, int lastCell, HSSFSheet sheet) {
        int value;
        HSSFRow row;
        int result;
        for (int cellIndex = firstCell; cellIndex < lastCell; cellIndex += 2) {
            value = 0;
            for (int rowIndex = from + 1; rowIndex <= to; rowIndex++) {
                row = sheet.getRow(rowIndex);
                value += row.getCell(cellIndex).getNumericCellValue();
            }
            result = (int) sheet.getRow(from).getCell(cellIndex).getNumericCellValue() - value;
            destination.getCell(cellIndex).setCellValue(result);

        }
        setLastValue(destination);
    }

    private Map.Entry<Integer, Integer> calculateMonth(int quarter) {
        int month;
        int year;
        if (quarter == 4) {
            year = Year.now().getValue() + 1;
            month = 1;
        } else {
            year = Year.now().getValue();
            month = (quarter - 1) * 3 + 1;
        }
        return new AbstractMap.SimpleImmutableEntry<>(year, month);
    }

}
