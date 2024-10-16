package com.collaborative.editor.controller.authentication;

import com.collaborative.editor.model.user.User;
import com.collaborative.editor.service.userService.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doThrow;

public class SignUpControllerTest {

    @InjectMocks
    private SignUpController signUpController;

    @Mock
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@example.com");
        user.setPassword("testUserPassword");
        user.setUsername("testUser");
    }

    @Test
    void createAccountSuccess() {

        ResponseEntity<Map<String, String>> response = signUpController.createAccount(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Account created successfully", response.getBody().get("message"));
    }

    @Test
    void createAccountFailureDueToExistingEmail() {
        doThrow(new IllegalArgumentException("User with this email already exists"))
                .when(userService).createUser(user);

        ResponseEntity<Map<String, String>> response = signUpController.createAccount(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User with this email already exists", response.getBody().get("message"));
    }

    @Test
    void createAccountFailureDueToInvalidEmail() {
        user.setEmail("invalid-email");

        doThrow(new IllegalArgumentException("Invalid email format"))
                .when(userService).createUser(user);

        ResponseEntity<Map<String, String>> response = signUpController.createAccount(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid email format", response.getBody().get("message"));
    }

    @Test
    void createAccountFailureDueToWeakPassword() {
        user.setPassword("1234");

        doThrow(new IllegalArgumentException("Password must be at least 8 characters long."))
                .when(userService).createUser(user);

        ResponseEntity<Map<String, String>> response = signUpController.createAccount(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password must be at least 8 characters long.", response.getBody().get("message"));
    }

    @Test
    void createAccountFailure() {
        doThrow(new RuntimeException("Failed")).when(userService).createUser(user);

        ResponseEntity<Map<String, String>> response = signUpController.createAccount(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Registration failed, please try again", response.getBody().get("message"));
    }

    @Test
    void githubGoogleSignIn() {
        RedirectView redirectView = signUpController.githubGoogleSignIn("google");

        assertEquals("/oauth2/authorization/google", redirectView.getUrl());
    }

    @Test
    void githubGithubSignIn() {
        RedirectView redirectView = signUpController.githubGoogleSignIn("github");

        assertEquals("/oauth2/authorization/github", redirectView.getUrl());
    }
}
