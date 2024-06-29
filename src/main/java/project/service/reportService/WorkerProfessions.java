package project.service.reportService;


public enum WorkerProfessions implements Profession {
    VODITELY_TR("Водители троллейбусов"),
    VODITELY_T("Машинисты трамваев"),
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
