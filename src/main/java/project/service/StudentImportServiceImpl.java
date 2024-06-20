package project.service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import project.exceptions.InvalidStudentIdException;
import project.model.ImportStudentResponse;
import project.model.Student;
import project.model.Subdepartment;
import project.repository.StudentJpaRepository;
import project.repository.SubdepartmentJpaRepository;

import java.io.InputStream;
import java.util.*;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;
import static project.exceptions.Validator.validateStudentId;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentImportServiceImpl {
    private final SubdepartmentJpaRepository subdepartmentJpaRepository;
    private final StudentJpaRepository studentJpaRepository;
    private static final String ATTENDANCE_REPORT_TEMPLATE_PATH = "/excelTemplate/student_add_template.xlsx";

    @NonNull
    public XSSFWorkbook getStudentImportTemplate() {
        XSSFWorkbook workbook = createWorkbook();
        return workbook;
    }

    private XSSFWorkbook createWorkbook() {
        try (InputStream inputStream = Objects.requireNonNull(getClass().getResourceAsStream(ATTENDANCE_REPORT_TEMPLATE_PATH))) {
            XSSFWorkbook wb = new XSSFWorkbook(inputStream);
            return wb;
        } catch (Exception e) {
            log.error("Ошибка на этапе чтения файла:", e);
            throw new RuntimeException("Файл шаблона не был загружен в корневую папку проекта или " +
                    "произошла другая ошибка связанная с чтением шаблонной таблицы", e);
        }
    }

    public ImportStudentResponse importStudents(XSSFWorkbook workbook, Integer departmentId) {
        setCurrentDataSource("DEP_" + departmentId);
        XSSFSheet sheet = workbook.getSheetAt(0);
        return saveStudent(sheet);

    }

    private ImportStudentResponse saveStudent(XSSFSheet sheet) {
        List<Student> createdStudents = new ArrayList<Student>();
        List<String> invalidStudentsId = new ArrayList<String>();

        Iterator<Row> rowIterator = sheet.rowIterator();
        Row row;
        rowIterator.next();
        while ( rowIterator.hasNext() && !(row = rowIterator.next()).getCell(0).getStringCellValue().isBlank()) {
            DataFormatter formatter = new DataFormatter();
            String studentId = StringUtils.trim( formatter.formatCellValue(row.getCell(0)));
            String studentName = StringUtils.trim( formatter.formatCellValue(row.getCell(1))).replaceAll(" +", " ");;
            String subdepartamentId = StringUtils.trim( formatter.formatCellValue(row.getCell(2)));

            Boolean isSubdepartamentIdShort = true;
            Short subdepartamentIdNumber = null;
            try {
                subdepartamentIdNumber = Short.parseShort(subdepartamentId);
            }catch (NumberFormatException e){
                isSubdepartamentIdShort = false;
            }
            if(!isSubdepartamentIdShort){
                invalidStudentsId.add(studentId);
            }else {
                Optional<Subdepartment> optionalSubdepartment = subdepartmentJpaRepository.findById(subdepartamentIdNumber);
                
                if (studentName.isBlank() || optionalSubdepartment.isEmpty() || !isStudentIdCorrect(studentId)) {
                    invalidStudentsId.add(studentId);
                } else {
                    Subdepartment subdepartment = optionalSubdepartment.get();
                    Student student = Student.builder()
                            .studentId(studentId)
                            .name(studentName)
                            .subdepartmentId(Short.parseShort( subdepartamentId))
                            .subdepartment(subdepartment)
                            .build();
                    createdStudents.add(studentJpaRepository.save(student));
                }
            }

        }
        ImportStudentResponse students = new ImportStudentResponse(createdStudents,invalidStudentsId);

        return students;
    }

    private boolean isStudentIdCorrect(String studentId) {
        try {
            validateStudentId(studentId);
        } catch (InvalidStudentIdException e) {
            return false;
        }
        return true;
    }

}
