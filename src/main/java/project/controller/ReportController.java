package project.controller;

import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.jetbrains.annotations.NotNull;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.model.QuarterDateModel;
import project.service.reportService.ReportService;

import java.time.LocalDate;
import java.time.Year;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;

import static project.exceptions.Validator.validateInterval;

@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/dep_{N}/report/stats")
    public ResponseEntity<ByteArrayResource> createReport(@RequestParam int quarter, @RequestParam int year,
                                                          @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        validateInterval(quarter);

        HSSFWorkbook reportFile = reportService.createReport(quarter, year);

        // Set response headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "Отчет_" + year + "г._" + quarter + "_квартал.xls");

        // Return ResponseEntity with file data and headers
        return ResponseEntity.ok()
                .headers(headers)
                .body(new ByteArrayResource(reportFile.getBytes()));
    }


    @GetMapping("/dep_{N}/report/date")
    public List<QuarterDateModel> getAvailableQuarterYear() {
        return reportService.getQuarterDateModelList();
    }


}
