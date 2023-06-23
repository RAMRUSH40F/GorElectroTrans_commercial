package project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.model.AttendanceId;
import project.model.AttendanceView;

import java.util.Date;

public interface ReportJpaRepository extends JpaRepository<AttendanceView, AttendanceId> {
    @Query("SELECT COUNT(a) FROM AttendanceView a WHERE a.date>=:dateFrom and a.date<:dateTo")
    Integer findAllBetweenDates(@Param("dateFrom") Date from, @Param("dateTo") Date to);
    @Query("SELECT COUNT(a) FROM AttendanceView a WHERE a.date>=:dateFrom and a.date<:dateTo and a.success=true")
    Integer findAllBetweenDateWithSuccess(@Param("dateFrom") Date from, @Param("dateTo") Date to);
    @Query("SELECT COUNT(a) FROM AttendanceView a WHERE a.date>=:dateFrom and a.date<:dateTo and a.success=true and a.subdepartment like concat(:subdepartmentName,'%') ")
    Integer findAllBetweenDatesWithSubdepartment(@Param("dateFrom") Date from, @Param("dateTo") Date to, @Param("subdepartmentName") String subdepartmentName);
}
