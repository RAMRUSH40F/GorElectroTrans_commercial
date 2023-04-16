package project.service;


public enum WorkerProfessions implements Profession{
    SLESARY("Водители"),
    VODITELY("Cлесари"),
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
