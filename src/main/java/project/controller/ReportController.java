package project.controller;

import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.exceptions.Validator;
import project.model.QuarterDateModel;
import project.security.JwtAuthorizationService;
import project.service.ReportService;

import java.nio.file.Paths;
import java.time.Year;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    private final JwtAuthorizationService auth;

    @GetMapping("/dep_{N}/report")
    public ResponseEntity<ByteArrayResource> getReport(@RequestParam int quarter,
                                                       @CookieValue(value = "token", defaultValue = "") String token) {
        Validator.validateInterval(quarter);
        auth.authorize(token, 100);
        final String fileName = Paths.get("src", "main", "resources", "report_template.xls").toString();
        HSSFWorkbook workbook = reportService.readWorkbook(fileName);
        reportService.formLessonReport(workbook, fileName, quarter);
        reportService.formWorkerReport(workbook, fileName);
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
    public List<QuarterDateModel> getYear(@CookieValue(value = "token", defaultValue = "") String token) {
        int year = Year.now().getValue();
        auth.authorize(token, 100);
        List<QuarterDateModel> intervals = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            intervals.add(new QuarterDateModel(year, i));
        }
        return intervals;
    }
}
