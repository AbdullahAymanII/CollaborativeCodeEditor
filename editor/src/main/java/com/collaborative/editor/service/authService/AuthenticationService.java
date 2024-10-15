package com.collaborative.editor.service.authService;


import com.collaborative.editor.dto.authentication.LoginRequest;

public interface AuthenticationService {
    String verify(LoginRequest loginRequest);
}
