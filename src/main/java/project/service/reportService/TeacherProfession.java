package project.service.reportService;

public enum TeacherProfession implements Profession {
    MASTER("Ст. мастер/мастер"),
    NASTAVNIK("Наставник"),
    RUKOVODITEL("Руководитель/зам.руководителя");
    private final String profession;
    @Override
    public String getProfession(){
        return profession;
    }
    TeacherProfession(String profession){ this.profession=profession;}

}
