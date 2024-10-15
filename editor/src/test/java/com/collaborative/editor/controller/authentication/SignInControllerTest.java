package com.collaborative.editor.controller.authentication;

import com.collaborative.editor.database.dto.authentication.LoginRequest;
import com.collaborative.editor.database.dto.authentication.LoginResponse;
import com.collaborative.editor.exception.InvalidCredentialsException;
import com.collaborative.editor.exception.UserNotFoundException;
import com.collaborative.editor.service.authService.AuthenticationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

public class SignInControllerTest {

    @InjectMocks
    private SignInController signInController;

    @Mock
    private AuthenticationServiceImpl authenticationService;

    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void signInSuccess() {

        String token = "mocked-jwt-token";
        when(authenticationService.verify(loginRequest)).thenReturn(token);

        ResponseEntity<LoginResponse> response = signInController.signIn(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Login successful", response.getBody().getMessage());
        assertEquals(token, response.getBody().getToken());
    }

    @Test
    void signInInvalidCredentials() {

        doThrow(new InvalidCredentialsException("Invalid credentials")).when(authenticationService).verify(loginRequest);

        ResponseEntity<LoginResponse> response = signInController.signIn(loginRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid credentials", response.getBody().getMessage());
    }

    @Test
    void signInUserNotFound() {

        doThrow(new UserNotFoundException("User not found")).when(authenticationService).verify(loginRequest);

        ResponseEntity<LoginResponse> response = signInController.signIn(loginRequest);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User not found", response.getBody().getMessage());
    }
}