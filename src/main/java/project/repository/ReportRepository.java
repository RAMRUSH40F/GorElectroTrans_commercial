package project.repository;

import lombok.RequiredArgsConstructor;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.FileInputStream;
import java.io.FileOutputStream;

@Repository("ReportRepositoryBean")
@RequiredArgsConstructor
public class ReportRepository {
   private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final JdbcTemplate jdbcTemplate;
    public  HSSFWorkbook readWorkbook(String filename) {
        try {
            POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(filename));
            HSSFWorkbook wb = new HSSFWorkbook(fs);
            return wb;
        }
        catch (Exception e) {
            return null;
        }
    }
    public  void writeWorkbook(HSSFWorkbook wb, String fileName) {
        try {
            FileOutputStream fileOut = new FileOutputStream(fileName);
            wb.write(fileOut);
            fileOut.close();
        }
        catch (Exception e) {
            //Обработка ошибки
        }
    }
    public  int makeSmth(int department){
        int id;
        StringBuilder query = new StringBuilder().append("SELECT id FROM DEP_")
                .append(department)
                .append(".lesson ORDER BY id DESC LIMIT 0, 1");
        id = jdbcTemplate.query(query.toString(), (rs, rowNum) -> rs.getInt("id")).get(1);
        return id;
    }
}
