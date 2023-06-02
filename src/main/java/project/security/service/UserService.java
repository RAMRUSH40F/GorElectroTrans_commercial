package project.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import project.security.model.User;
import project.security.repository.UserJpaRepository;

import java.util.Optional;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserJpaRepository repository;

    public @Nullable User getUserByUsername(String username) {
        setCurrentDataSource("USERS");
        Optional<User> user = repository.findById(username);
        return user.orElse(null);
    }

}
