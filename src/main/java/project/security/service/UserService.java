package project.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import project.security.model.User;
import project.security.UserJpaRepository;

import java.util.HashSet;
import java.util.Optional;

import static project.dataSource.DynamicDataSourceContextHolder.setCurrentDataSource;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserJpaRepository repository;

    @NonNull
    public User getUserByUsername(@NonNull String username) {
        setCurrentDataSource("USERS");
        Optional<User> user = repository.findById(username);
        return user.orElse(new User("", "", false, new HashSet<>()));
    }

}
