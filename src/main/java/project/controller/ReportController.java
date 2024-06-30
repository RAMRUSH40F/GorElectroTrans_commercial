package project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import static project.exceptions.Validator.validateDate;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ReportController {
    private final ReportService reportService;

    @GetMapping("/dep_{N}/report/stats")
    public ResponseEntity<ByteArrayResource> createReport(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateFrom,
                                                          @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateTo,
                                                          @RequestHeader(value = HttpHeaders.AUTHORIZATION, defaultValue = "") String jwtToken) {
        validateDate(dateFrom, dateTo);

        ByteArrayOutputStream byteArrayOutputStream = convertWorkbookToByteArray(reportService.createReport(dateFrom, dateTo));

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


    private ByteArrayOutputStream convertWorkbookToByteArray(XSSFWorkbook workbook) {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
            workbook.write(byteArrayOutputStream);
            return byteArrayOutputStream;
        } catch (IOException e) {
            log.info("Ошибка при конвертации отчета в массив байтов");
            throw new RuntimeException(e);
        }
    }

}
