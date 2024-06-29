package project.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ReportRepository {
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;


    public Integer findAllLessonsBetweenDates(LocalDate dateFrom, LocalDate dateTo) {
        return namedParameterJdbcTemplate.queryForObject("SELECT COUNT(1) FROM lesson WHERE `date` BETWEEN :dateFrom and :dateTo",
                Map.of("dateFrom", dateFrom, "dateTo", dateTo), Integer.class);
    }

    public Integer findAllLessonsBetweenDatesWithHeld(LocalDate dateFrom, LocalDate dateTo) {
        return namedParameterJdbcTemplate.queryForObject("SELECT COUNT(1) FROM lesson WHERE `date` BETWEEN :dateFrom and :dateTo and status='HELD'",
                Map.of("dateFrom", dateFrom, "dateTo", dateTo), Integer.class);
    }
    public Integer findAllThemesBetweenDates(LocalDate dateFrom, LocalDate dateTo) {
        return namedParameterJdbcTemplate.queryForObject("SELECT COUNT(1)FROM(SELECT DISTINCT topic FROM lesson WHERE DATE BETWEEN :dateFrom and :dateTo) AS td;",
                Map.of("dateFrom", dateFrom, "dateTo", dateTo), Integer.class);
    }

    public Integer findAllThemesBetweenDatesWithHeld(LocalDate dateFrom, LocalDate dateTo) {
        return namedParameterJdbcTemplate.queryForObject("SELECT COUNT(1)FROM(SELECT DISTINCT topic FROM lesson WHERE DATE BETWEEN :dateFrom and :dateTo and status='HELD') AS td",
                Map.of("dateFrom", dateFrom, "dateTo", dateTo), Integer.class);
    }


    public Integer findAllWorkersBetweenDates(LocalDate dateFrom, LocalDate dateTo) {
        return namedParameterJdbcTemplate.queryForObject("SELECT COUNT(1) FROM attendance_view WHERE `date` BETWEEN :dateFrom and :dateTo",
                Map.of("dateFrom", dateFrom, "dateTo", dateTo), Integer.class);
    }

    public Integer findAllWorkersBetweenDatesWithSuccess(LocalDate dateFrom, LocalDate dateTo) {
        return namedParameterJdbcTemplate.queryForObject("SELECT COUNT(1) FROM attendance_view WHERE `date` BETWEEN :dateFrom and :dateTo and success=1",
                Map.of("dateFrom", dateFrom, "dateTo", dateTo), Integer.class);
    }

    public Integer findAllWorkersBetweenDatesWithSuccessAndProfession(LocalDate dateFrom, LocalDate dateTo, String profession) {
        return namedParameterJdbcTemplate.queryForObject("SELECT COUNT(1) FROM attendance_view WHERE `date` BETWEEN :dateFrom and :dateTo and success=1 and subdepartment LIKE :profession",
                Map.of("dateFrom", dateFrom, "dateTo", dateTo, "profession", profession), Integer.class);
    }

    public Integer findAllTeachersByProfession(LocalDate dateFrom, LocalDate dateTo, String profession) {
        return namedParameterJdbcTemplate.queryForObject("SELECT COUNT(1) FROM lesson WHERE `date` BETWEEN :dateFrom and :dateTo AND teacherPost LIKE :profession",
                Map.of("dateFrom", dateFrom, "dateTo", dateTo, "profession", profession), Integer.class);
    }
}
