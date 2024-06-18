package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ReportRepository {
    @Autowired
    private final JdbcTemplate jdbcTemplate;
public Integer findAllLessonsBetweenDates(int year, int month){
    return jdbcTemplate.query("SELECT COUNT(1) FROM lesson WHERE `date` BETWEEN '"
                    + year + "-"
                    + month
                    + "-01' AND '"
                    + year + "-"
                    + (month + 3) + "-01'",
            (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0);
}
    public Integer findAllLessonsBetweenDatesWithHeld(int year, int month){
        return jdbcTemplate.query("SELECT COUNT(1) FROM lesson WHERE `date` BETWEEN '"
                        + year + "-"
                        + month
                        + "-01' AND '"
                        + year + "-"
                        + (month + 3) + "-01' and status='HELD'",
                (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0);
    }
    public Integer findAllWorkersBetweenDates(int year,int month){
        return jdbcTemplate.query("SELECT COUNT(1) FROM "
                        + "attendance_view WHERE `date` BETWEEN '"
                        + year +
                        + month
                        + "-01' AND '"
                        + year + "-"
                        + (month + 3)
                        + "-01'",
                (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0);
    }
    public Integer findAllWorkersBetweenDatesWithSuccess(int year,int month){
        return jdbcTemplate.query("SELECT COUNT(1) FROM "
                + "attendance_view WHERE `date` BETWEEN '"
                + year+ "-"
                + month
                + "-01' AND '"
                + year + "-"
                + (month + 3)
                + "-01' and success=1",(rs,rowNum)->rs.getInt("COUNT(1)")).get(0);
    }
    public Integer findAllWorkersBetweenDatesWithSuccessAndProfession(int year,int month,String profession){
        return jdbcTemplate.query("SELECT COUNT(1) FROM "
                + "attendance_view WHERE `date` BETWEEN '"
                + year + "-"
                + month
                + "-01' AND '"
                + year + "-"
                + (month + 3) + "-"
                + "01' AND success=1 AND subdepartment LIKE '" + profession + "%'",(rs,rowNum)->rs.getInt("COUNT(1)")).get(0);
    }
    public Integer findAllTeachersByProfession(int year,int month,String profession){
    return jdbcTemplate.query("SELECT COUNT(1) FROM "
                    + "lesson WHERE `date` BETWEEN '"
                    + year  + "-"
                    + month
                    + "-01' AND '"
                    + year   + "-"
                    + (month + 3)
                    + "-01' AND teacherPost LIKE '"
                    + profession + "'",
            (rs, rowNum) -> rs.getInt("COUNT(1)")).get(0);
    }
}
