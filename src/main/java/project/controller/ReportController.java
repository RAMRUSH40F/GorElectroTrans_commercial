package project.controller;

import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.model.IntervalModel;
import project.repository.ReportRepository;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReportController {
    @Autowired
    ReportRepository reportRepository;

    @GetMapping("/dep_{N}/report")
    public byte[] getReport(@RequestParam int interval) {
        String filename = "C:\\Users\\artem\\Downloads\\1.xls";
        // раскомитить, когда будет готов шаблон
        // String filename="\\resources\\1.xls";
        HSSFWorkbook workbook = reportRepository.readWorkbook(filename);
        reportRepository.formLessonReport(workbook, filename, interval);
        reportRepository.formWorkerReport(workbook, filename);
        return workbook.getBytes();
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
