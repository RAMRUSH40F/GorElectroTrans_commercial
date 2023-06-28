package project.service.reportService;


public enum WorkerProfessions implements Profession{
    VODITELYTR("Водители троллейбусов"),
    VODITELYT("Машинисты трамваев"),
    SLESARY("Слесари"),
    DISPETCHERS("Диспетчеры"),
    SPECIALISTS("Специалисты УГМ");

    private final String profession;
@Override
    public String getProfession() {
        return profession;
    }

    WorkerProfessions(String profession) {
        this.profession = profession;
    }
}
