package project.repository;


public enum Professions {
    SLESARY(1),
    VODITELY(2),
    OTHERS(3);

    private final int professionsId;

    public int getProfessionsId() {
        return professionsId;
    }

    Professions(int id) {
        professionsId = id;
    }
}
