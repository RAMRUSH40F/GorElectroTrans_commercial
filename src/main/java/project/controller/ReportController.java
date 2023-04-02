package project.controller;

import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.checkerframework.checker.units.qual.N;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import project.repository.ReportRepository;

@RestController
@RequiredArgsConstructor
public class ReportController {
    @Autowired
    ReportRepository reportRepository;
    @GetMapping("/dep_{N}/report")
    public void getREPORT(@PathVariable int N){
        String filename="C:\\Users\\artem\\Downloads\\1.xls";
        HSSFWorkbook workbook= reportRepository.readWorkbook(filename);
        HSSFSheet sheet=workbook.getSheetAt(0);
        HSSFRow row=sheet.getRow(1);
        HSSFCell cell=row.getCell(2);
        reportRepository.makeSmth(N);
        cell.setCellValue("Hello");

        cell.setCellValue(reportRepository.makeSmth(N));
        reportRepository.writeWorkbook(workbook,filename);

    }
}
