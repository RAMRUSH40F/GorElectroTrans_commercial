package project.security;

import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import project.exceptions.AuthenticationException;
import project.model.User;
import project.repository.UserRepository;

import javax.annotation.PostConstruct;
import javax.servlet.http.Cookie;
import java.util.Base64;
import java.util.Date;

@Service("JwtAuthorizationServiceBean")
@RequiredArgsConstructor
public class JwtAuthorizationService {

    @Value("${jwt_expiration_hours}")
    private Integer JWT_TOKEN_MAX_AGE_HOURS;

    @Value("${jwt_secret}")
    private String secretKey;

    private final UserRepository userRepository;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public boolean validateToken(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parser()
                    .setSigningKey(secretKey).parseClaimsJws(token);
            return !claimsJws.getBody().getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException exception) {
            throw new AuthenticationException("Ошибка сервера");
        }


    }

    public Cookie authenticate(String username, String password) {
        User user = userRepository.getUserByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            if (user.isActive()) {
                String jwtToken = createToken(new User(username, null, user.isActive(), user.getAuthorities()));

                Cookie cookie = new Cookie("Token", jwtToken);

                cookie.setMaxAge(JWT_TOKEN_MAX_AGE_HOURS * 3600);
                cookie.setSecure(true);
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                return cookie;
            }
            throw new AuthenticationException("Этот аккаунт был отключен в базе данных, обратитесь к администратору.");

        } else {
            throw new AuthenticationException("Неправильный логин или пароль.");
        }

    }

    private String createToken(User user) {

        //create jwt token out of authorities and username;
        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("role", user.getAuthorities());

        Date now = new Date();
        Date validity = new Date(now.getTime() + JWT_TOKEN_MAX_AGE_HOURS * 3600 * 1000);
        String jwtToken = Jwts.builder()
                .setClaims(claims)
                .setExpiration(validity)
                .setIssuedAt(now)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();


        return jwtToken;
    }
}

