package project.security.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import project.security.exception.AuthenticationException;
import project.security.model.Authority;
import project.security.model.User;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtAuthorizationService {

    @Value("${jwt_expiration_hours}")
    private Integer JWT_TOKEN_MAX_AGE_HOURS;

    @Value("${jwt_secret}")
    private String secretKey;

    private final UserService userService;

    /**
     * Checks if the password is right and return authorisation
     * jwtToken in cookie or throws an exception
     */
    public @NonNull String authenticate(User user) {
        User userFromRepository = userService.getUserByUsername(user.getUsername());
        if (userFromRepository.getPassword().equals(user.getPassword())) {
            if (user.isActive()) {
                return createToken(userFromRepository);
            }
            throw new AuthenticationException("Этот аккаунт был отключен в базе данных, обратитесь к администратору.");

        } else {
            throw new AuthenticationException("Неправильный логин или пароль.");
        }

    }

    public void authorize(String jwtToken, Integer departmentID) {
        validateToken(jwtToken);
        Set<String> userAuthorities = decodeUserFromToken(jwtToken).getAuthorities();
        // admin role ("100") has authorization to everything
        if (!(userAuthorities.contains("100") || userAuthorities.contains(String.valueOf(departmentID)))) {
            String exceptionText = "У пользователя нет доступа к данной информации." +
                    "Права пользователя:" + userAuthorities +
                    "Необходимые права:" + departmentID;
            throw new AuthenticationException(exceptionText);
        }
    }


    /**
     * @return true if the token is valid and does not expire. False otherwise.
     */
    public boolean validateToken(String token) {
        try {
            if (token.isEmpty()) {
                throw new AuthenticationException("Прежде чем пользоваться сервисом войдите в аккаунт.");
            }
            Jws<Claims> claimsJws = Jwts.parser()
                    .setSigningKey(secretKey).parseClaimsJws(token);
            boolean userIsActive = decodeUserFromToken(token).isActive();
            boolean tokenIsExpired = !claimsJws.getBody().getExpiration().before(new Date());
            return userIsActive & tokenIsExpired;
        } catch (JwtException | IllegalArgumentException exception) {
            throw new AuthenticationException(exception,
                    "Прежде чем пользоваться сервисом войдите в аккаунт заново");
        }
    }


    public @NonNull User decodeUserFromToken(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);

            User user = new User();

            String username = jwt.getSubject();
            user.setUsername(username);

            Set<String> authorities = new HashSet<>(jwt.getClaim("role").asList(String.class));
            user.setAuthorities(authorities.stream().map(s -> new Authority("", s)).collect(Collectors.toSet()));

            return user;
        } catch (JWTVerificationException e) {
            throw new AuthenticationException(e, "Ошибка при конвертации данных из токена авторизации, попробуйте перезайти в аккаунт.");
        }
    }


    /**
     * @return jwt token out of authorities and username;
     */
    private @NonNull String createToken(@NonNull User user) {
        Claims claims = Jwts.claims().setSubject(user.getUsername());
        claims.put("role", user.getAuthorities());

        Date now = new Date();
        Date validity = new Date(now.getTime() + JWT_TOKEN_MAX_AGE_HOURS * 3600 * 1000);
        String token = Jwts.builder()
                .setClaims(claims)
                .setExpiration(validity)
                .setIssuedAt(now)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
        return token;
    }


}

