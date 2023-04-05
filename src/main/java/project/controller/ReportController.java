package project.controller;

import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.exceptions.Validator;
import project.model.IntervalModel;
import project.repository.ReportService;

import java.io.File;
import java.time.Year;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/dep_{N}/report")
    public ResponseEntity<ByteArrayResource> getReport(@RequestParam int quoter) {
        Validator.validateInterval(quoter);
        final String filename = "src" + File.separator + "main" + File.separator + "resources" + File.separator + "report_template.xls";
        HSSFWorkbook workbook = reportService.readWorkbook(filename);
        reportService.formLessonReport(workbook, filename, quoter);
        reportService.formWorkerReport(workbook, filename);
        String today = new Date().toString().substring(4, 10);
        // Set response headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", today + " OTCHET.xls");

        // Return ResponseEntity with file data and headers
        return ResponseEntity.ok()
                .headers(headers)
                .body(new ByteArrayResource(workbook.getBytes()));
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
