package project.security.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;


@Setter
@Getter

@Entity
@Table(name = "authorities")
public class Authority {

    @Id
    private String username;

    @Column(name = "authority")
    private String authority;


    public Authority() {
    }

    public Authority(String username, String authority) {
        this.username = username;
        this.authority = authority;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Authority authority1 = (Authority) o;

        return getAuthority().equals(authority1.getAuthority());
    }

    @Override
    public int hashCode() {
        return getAuthority().hashCode();
    }

    @Override
    public String toString() {
        return getAuthority();
    }
}
