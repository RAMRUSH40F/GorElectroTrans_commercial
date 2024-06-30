package project.service.reportService;

public enum TeacherProfession implements Profession {
    RUKOVODITEL("Руководитель/зам.руководителя"),
    MASTER("Ст. мастер/мастер"),
    NASTAVNIK("Наставник");

    private final String profession;

    @Override
    public String getProfession() {
        return profession;

    }

    TeacherProfession(String profession) {
        this.profession = profession;
    }

}
