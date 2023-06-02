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

}
