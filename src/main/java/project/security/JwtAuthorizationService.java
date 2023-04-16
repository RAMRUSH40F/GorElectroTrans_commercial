package project.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import project.exceptions.AuthenticationException;
import project.security.model.User;
import project.repository.UserRepository;

import javax.servlet.http.Cookie;
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
            Jws<Claims> claimsJws = Jwts.parser()
                    .setSigningKey(secretKey).parseClaimsJws(token);
            boolean userIsActive = decodeUserFromToken(token).isActive();
            boolean tokenIsExpired = !claimsJws.getBody().getExpiration().before(new Date());
            return userIsActive & tokenIsExpired;
        } catch (JwtException | IllegalArgumentException exception) {
            throw new RuntimeException(exception);
        }
    }


    public User decodeUserFromToken(String token) {
        DecodedJWT jwt = JWT.decode(token);
        String user = jwt.getSubject();
        return userRepository.getUserByUsername(user);
    }

    /**
     * Checks if the password is right and return authorisation
     * authentication jwtToken in cookie or throws an exception
     *
     */
    public Cookie authenticate(String username, String password) {
        User user = userRepository.getUserByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            if (user.isActive()) {
                String jwtToken = createToken(user);

                Cookie cookie = new Cookie("Token", jwtToken);

                cookie.setMaxAge(JWT_TOKEN_MAX_AGE_HOURS * 3600);
                cookie.setSecure(true);
                cookie.setHttpOnly(false); // false - можно достать данные на фронтэнде. true - доставать нельзя. Только отправлять
                cookie.setPath("/");
                return cookie;
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
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(validity)
                .setIssuedAt(now)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }
}

