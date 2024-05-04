package project.authentication.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Setter
@Getter

@Entity
@Table(name = "authorities")
public class Authority {

    @Id
    private String username;

    @Column(name = "authority")
    private String permission;


    public Authority() {
    }

    public Authority(String username, String permission) {
        this.username = username;
        this.permission = permission;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Authority authority1 = (Authority) o;

        return getPermission().equals(authority1.getPermission());
    }

    @Override
    public int hashCode() {
        return getPermission().hashCode();
    }

    @Override
    public String toString() {
        return getPermission();
    }
}
