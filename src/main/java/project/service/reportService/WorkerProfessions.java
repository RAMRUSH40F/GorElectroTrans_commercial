package project.service.reportService;


public enum WorkerProfessions implements Profession{
    SLESARY("Слесари"),
    VODITELYT("Водители трамваев"),
    VODITELYTR("Водители троллейбусов"),
    DISPETCHERS("Диспетчеры"),
    SPECIALISTS("Специалисты УГМ"),
    OTHERS("Другие");

    private final String profession;
@Override
    public String getProfession() {
        return profession;
    }

    WorkerProfessions(String profession) {
        this.profession = profession;
    }
}
