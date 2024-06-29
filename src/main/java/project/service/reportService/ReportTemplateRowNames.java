package project.service.reportService;

public enum ReportTemplateRowNames {
    LESSON_PLAN(2),
    LESSON_HANDLE(3),
    THEME_PLAN(4),
    THEME_HANDLE(5),
    STUDENTS_PLAN(6),
    STUDENTS_ALL(7),
    STUDENTS_TROLL(8),
    STUDENTS_TRAM(9),
    STUDENTS_SLESARY(10),
    STUDENTS_DISPETCHER(11),
    STUDENTS_UGM(12),
    TEACHER_PLAN(14),
    TEACHER_RUKOVOD(15),
    TEACHER_MASTER(16),
    TEACHER_NASTAVNICK(17);

    public int getIndex() {
        return index;
    }

    private final int index;

    ReportTemplateRowNames(int index) {
        this.index = index;
    }
}
