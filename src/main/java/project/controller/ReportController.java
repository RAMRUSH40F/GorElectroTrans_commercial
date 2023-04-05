package project.controller;

import lombok.RequiredArgsConstructor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.exceptions.Validator;
import project.model.IntervalModel;
import project.service.ReportService;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/dep_{N}/report")
    public byte[] getReport(@RequestParam int interval) throws FileNotFoundException {
        Validator.validateInterval(interval);
        final String filename = "src" + File.separator + "main" + File.separator + "resources" + File.separator + "report_template.xlsx";
        XSSFWorkbook workbook = reportService.readWorkbook(filename);
        reportService.formLessonReport(workbook, filename, interval);
        reportService.formWorkerReport(workbook, filename);
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        try {
            workbook.write(result);
            return result.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/dep_{N}/report/date")
    public List<IntervalModel> getYear() {
        int year = Year.now().getValue();
        List<IntervalModel> intervals = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            intervals.add(new IntervalModel(year, i));
        }
        return intervals;
    }
}
