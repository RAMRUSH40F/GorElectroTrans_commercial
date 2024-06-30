package project.service.reportService;


public enum WorkerProfession implements Profession {
    DRIVER_TROLLEYBUS("Водители троллейбусов"),
    DRIVER_TRAMWAY("Машинисты трамваев"),
    SLESARY("Слесари"),
    DISPETCHERS("Диспетчеры"),
    SPECIALISTS("Специалисты УГМ");

    private final String profession;

    @Override
    public String getProfession() {
        return profession;
    }

    WorkerProfession(String profession) {
        this.profession = profession;
    }
}
