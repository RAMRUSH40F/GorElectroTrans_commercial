package project.repository;

import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.nullness.qual.Nullable;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import project.security.model.User;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Repository("UserRepositoryBean")
@RequiredArgsConstructor
public class UserRepository {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public @Nullable User getUserByUsername(String username) {
        String GET_USER_TEMPLATE =
                "SELECT * FROM USERS.users WHERE username=:username";
        String GET_AUTHORITIES_TEMPLATE =
                "SELECT authority FROM USERS.authorities WHERE username=:username";
        Map<String, Object> userData = new HashMap<>();
        userData.put("username", username);


        List<String> userAuthorities = namedParameterJdbcTemplate.query(GET_AUTHORITIES_TEMPLATE, userData,
                (rs, num) -> (rs.getString("authority")));
        try {
            User user = namedParameterJdbcTemplate.queryForObject(GET_USER_TEMPLATE, userData,
                    (rs, rowNum) -> User.builder()
                            .username(rs.getString("username"))
                            .password(rs.getString("password"))
                            .isActive(rs.getBoolean("enabled"))
                            .authorities(new HashSet<>(userAuthorities))
                            .build());
            if (user != null && user.getUsername() != null && user.getAuthorities() != null && user.getPassword() != null) {
                return user;
            } else {
                return null;
            }
        } catch (DataAccessException e) {
            return null;
        }

    }


}