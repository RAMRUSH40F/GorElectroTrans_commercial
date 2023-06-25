package project.security.model;

import lombok.*;

import javax.persistence.*;
import java.util.Set;
import java.util.stream.Collectors;


@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Setter
@Getter


@Entity
@Table(name = "users")
public class User {

    @Id
    private String username;

    @Column
    private String password;

    @Column(name = "enabled")
    private boolean isActive;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "username")
    private Set<Authority> authorities;

    public Set<String> getAuthorities() {
        return authorities.stream().map(Authority::getPermission).collect(Collectors.toSet());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (isActive() != user.isActive()) return false;
        if (!getUsername().equals(user.getUsername())) return false;
        return getPassword() != null ? getPassword().equals(user.getPassword()) : user.getPassword() == null;
    }

    @Override
    public int hashCode() {
        int result = getUsername().hashCode();
        result = 31 * result + (getPassword() != null ? getPassword().hashCode() : 0);
        result = 31 * result + (isActive() ? 1 : 0);
        return result;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", isActive=" + isActive +
                ", authorities=" + authorities +
                '}';
    }
}
