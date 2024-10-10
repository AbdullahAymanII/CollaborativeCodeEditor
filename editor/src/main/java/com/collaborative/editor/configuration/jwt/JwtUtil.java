package com.collaborative.editor.configuration.jwt;

import com.collaborative.editor.model.mysql.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final UserDetailsService userDetailsService;
    private static final long TOKEN_VALIDITY = 1000 * 60 * 60 * 10; // 10 hours

    public JwtUtil(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    public String generateToken(Authentication authentication) {
        String email = getEmail(authentication);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String getEmail(Authentication authentication) {

        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            System.out.println("+++++++++++++++++++++++++++++++++++++++");
            System.out.println("userDetails");
            System.out.println(userDetails.getUsername());
            System.out.println("+++++++++++++++++++++++++++++++++++++++");
            return userDetails.getUsername();
        }

        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {

            return oauthToken.getPrincipal().getAttribute("email");
//            String registrationId = oauthToken.getAuthorizedClientRegistrationId().toLowerCase();
//
//            System.out.println("+++++++++++++++++++++++++++++++++++++++");
//            System.out.println("OAuth2AuthenticationToken");
//            System.out.println(registrationId);
//            System.out.println("+++++++++++++++++++++++++++++++++++++++");
//
//            return switch (registrationId) {
//                case "google" -> oauthToken.getPrincipal().getAttribute("email");
//                case "github" -> oauthToken.getPrincipal().getAttribute("email");
//                default ->
//                        throw new IllegalArgumentException("Unsupported OAuth2 client registration id: " + registrationId);
//            };

        }
        throw new IllegalArgumentException("Unsupported authentication principal type");
    }


    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public Authentication getAuthentication(String token) {
        String username = getUsernameFromToken(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
