package project.service;

import lombok.RequiredArgsConstructor;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import project.repository.Professions;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.Year;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final JdbcTemplate jdbcTemplate;

    public XSSFWorkbook readWorkbook(String filePath) {
        try {
            XSSFWorkbook excelFile = new XSSFWorkbook(new FileInputStream(filePath));
            return excelFile;
        } catch (IOException e) {
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы");
        }

    }

    public void writeWorkbook(XSSFWorkbook wb, String fileName) {

        FileOutputStream fileOut = null;
        try {
            fileOut = new FileOutputStream(fileName);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
        try {
            wb.write(fileOut);
        } catch (IOException e) {
            throw new RuntimeException(e);

        }
    }

    public void formLessonReport(XSSFWorkbook wb, String fileName, int interval) {

        XSSFSheet sheet = wb.getSheet("mainList");
        XSSFRow row1 = sheet.getRow(2);
        XSSFRow row2 = sheet.getRow(3);
        XSSFCell cell1;
        XSSFCell cell2;
        int firstCell = 1;
        int lastCell = 31;
        int year = Year.now().getValue();
        int total = 0;
        int result;

        for (int i = firstCell; i < lastCell; i += 2) {
            cell1 = row1.getCell(i);
            cell2 = row2.getCell(i);
            if (interval < 4) {
                result = jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (i / 2 + 1) + ".lesson WHERE `date` BETWEEN '" + year + "-0" + (1 + 3 * interval) + "-01' AND '" + year + "-0" + (4 + 3 * interval) + "-01'", (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0);
            } else {
                result = jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (i / 2 + 1) + ".lesson WHERE `date` BETWEEN '" + year + "-0" + (1 + 3 * interval) + "-01' AND '" + (year + 1) + "-01-01'", (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0);
            }
            total += result;
            cell1.setCellValue(result);
            cell2.setCellValue(result);
        }

        cell1 = row1.getCell(lastCell);
        cell2 = row2.getCell(lastCell);

        cell1.setCellValue(total);
        cell2.setCellValue(total);

        writeWorkbook(wb, fileName);
    }

    public void formWorkerReport(XSSFWorkbook wb, String filename) {
        XSSFSheet sheet = wb.getSheet("mainList");
        XSSFRow row1 = sheet.getRow(7);
        XSSFCell cell1;
        int firstCell = 1;
        int lastCell = 31;
        int total = 0;
        int result;
        for (int i = firstCell; i < lastCell; i += 2) {
            cell1 = row1.getCell(i);
            result = jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (i / 2 + 1) + ".student", (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0);
            total += result;
            cell1.setCellValue(result);
        }
        formSpecificWorkersReport(Professions.VODITELY.getProfessionsId(), sheet.getRow(8));
        formSpecificWorkersReport(Professions.SLESARY.getProfessionsId(), sheet.getRow(9));
        cell1 = row1.getCell(lastCell);
        cell1.setCellValue(total);
        writeWorkbook(wb, filename);
    }

    private void formSpecificWorkersReport(int profession, XSSFRow row) {
        int firstCell = 1;
        int lastCell = 31;
        int total = 0;
        int result = 0;
        XSSFCell cell;
        for (int i = firstCell; i < lastCell; i += 2) {
            cell = row.getCell(i);
            result = jdbcTemplate.query("SELECT COUNT(1) FROM DEP_" + (i / 2 + 1) + ".student WHERE subdepartment_id=" + (profession * 100 + (i / 2 + 1)), (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0);
            total += result;
            cell.setCellValue(result);
        }
        cell = row.getCell(lastCell);
        cell.setCellValue(total);

    }

}
