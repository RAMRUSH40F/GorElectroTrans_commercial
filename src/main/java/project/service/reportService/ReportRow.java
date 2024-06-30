package project.service.reportService;

public enum ReportRow {
    LESSON_PLAN(2),
    LESSON_HELD(3),
    TOPIC_PLAN(4),
    TOPIC_HELD(5),
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

    ReportRow(int index) {
        this.index = index;
    }
}
