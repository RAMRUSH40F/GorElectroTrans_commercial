package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.model.QuarterDateModel;
import project.service.reportService.ReportService;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

import static project.exceptions.Validator.validateInterval;

@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/dep_{N}/report/stats")
    public ResponseEntity<ByteArrayResource> createReport(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateFrom,
                                                          @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateTo) {
        //validateInterval(dateFrom);

        ByteArrayOutputStream byteArrayOutputStream = reportService.createReport(dateFrom, dateTo);

        // Set response headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "Отчет_" + dateTo + "г._" + dateFrom + "_квартал.xlsx");

        // Return ResponseEntity with file data and headers
        return ResponseEntity.ok()
                .headers(headers)
                .body(new ByteArrayResource(byteArrayOutputStream.toByteArray()));
    }

    @Deprecated
    @GetMapping("/dep_{N}/report/date")
    public List<QuarterDateModel> getAvailableQuarterYear() {
        return reportService.getQuarterDateModelList();
    }


}
