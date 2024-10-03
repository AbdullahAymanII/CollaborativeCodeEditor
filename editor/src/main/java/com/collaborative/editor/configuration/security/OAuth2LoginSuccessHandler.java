package com.collaborative.editor.configuration.security;

import com.collaborative.editor.configuration.jwt.JwtUtil;
import com.collaborative.editor.model.mysql.user.RegistrationSource;
import com.collaborative.editor.model.mysql.user.Role;
import com.collaborative.editor.model.mysql.user.User;
import com.collaborative.editor.service.userService.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Random;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {

        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {

            String registrationId = oauthToken.getAuthorizedClientRegistrationId();

            if ("google".equalsIgnoreCase(registrationId)) {
                handleGoogleLogin(oauthToken.getPrincipal());
            } else if ("github".equalsIgnoreCase(registrationId)) {
                handleGitHubLogin(oauthToken.getPrincipal());
            }
        }

        String jwtToken = generateJwtToken(authentication);
//        response.sendRedirect("http://collaborative-frontend:3000/oauth2/redirect?token=" + jwtToken);
         response.sendRedirect("http://localhost:3000/oauth2/redirect?token=" + jwtToken);
    }

    private void handleGoogleLogin(OAuth2User principal) {
        String username = principal.getAttribute("name");
        String email = principal.getAttribute("email");
        userService.findUserByEmail(email)
                .ifPresentOrElse(
                        user -> {},
                        () -> createNewUser(email, username, Role.USER, RegistrationSource.GOOGLE)
                );
    }

    private void handleGitHubLogin(OAuth2User principal) {
        String username = principal.getAttribute("login");
        String email = principal.getAttribute("email");
        System.out.println("gitHubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"+username+ "       "+ email);
        if (email == null) {
            email = username;
        }

        String finalEmail = email ;
        userService.findUserByEmail(finalEmail)
                .ifPresentOrElse(
                        user -> {},
                        () -> createNewUser(finalEmail, username, Role.USER, RegistrationSource.GITHUB)
                );
    }


    private void createNewUser(String email, String username, Role role, RegistrationSource source) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setRole(role);
        user.setPassword("RANDOM-PASSWORD");
        user.setSource(source);
        userService.createUser(user);
    }

    private String generateJwtToken(Authentication authentication) {
        return jwtUtil.generateToken(authentication);
    }
}
