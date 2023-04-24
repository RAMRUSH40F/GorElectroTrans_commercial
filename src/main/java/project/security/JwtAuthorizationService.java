package project.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import project.repository.UserRepository;
import project.security.exception.AuthenticationException;
import project.security.model.User;

import java.util.Date;

@Service("JwtAuthorizationServiceBean")
@RequiredArgsConstructor
public class JwtAuthorizationService {

    @Value("${jwt_expiration_hours}")
    private Integer JWT_TOKEN_MAX_AGE_HOURS;

    @Value("${jwt_secret}")
    private String secretKey;

    private final UserRepository userRepository;

    /**
     * @return true if the token is valid and does not expire. False otherwise.
     */
    public boolean validateToken(String token) {
        try {
            if(token.isEmpty()){
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


    public User decodeUserFromToken(String token) {
        try {
            DecodedJWT jwt = JWT.decode(token);
            String user = jwt.getSubject();
            return userRepository.getUserByUsername(user);
        } catch (JWTVerificationException e) {
            throw new AuthenticationException(e, "Ошибка при проверке уровня прав пользователя. " +
                    "Скорее всего, токен авторизации невалиден");
        }
    }

    /**
     * Checks if the password is right and return authorisation
     * jwtToken in cookie or throws an exception
     */
    public String authenticate(String username, String password) {
        User user = userRepository.getUserByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            if (user.isActive()) {
                return createToken(user);
            }
            throw new AuthenticationException("Этот аккаунт был отключен в базе данных, обратитесь к администратору.");

        } else {
            throw new AuthenticationException("Неправильный логин или пароль.");
        }

    }

    /**
     * @return jwt token out of authorities and username;
     */
    private String createToken(User user) {
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

    public void authorize(String jwtToken, int departmentID) {
        validateToken(jwtToken);
        User user = decodeUserFromToken(jwtToken);
        // admin role ("100") has authorization to everything
        if (!(user.getAuthorities().contains("100") || user.getAuthorities().contains(String.valueOf(departmentID)))) {
            System.out.println("Права пользователя:" + user.getAuthorities());
            System.out.println("Необходимые права:" + departmentID);
            throw new AuthenticationException("У пользователя нет доступа к данной информации.");
        }
    }
}

