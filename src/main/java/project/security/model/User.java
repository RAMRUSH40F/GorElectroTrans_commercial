package project.security.model;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@Builder
@RequiredArgsConstructor
public class User {
    private final String username;
    private final String password;
    private final boolean isActive;
    private final List<String> authorities;

}
