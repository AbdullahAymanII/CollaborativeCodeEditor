package com.collaborative.editor.service.authService;

import com.collaborative.editor.configuration.jwt.JwtUtil;
import com.collaborative.editor.dto.authentication.LoginRequest;
import com.collaborative.editor.exception.authenticaionException.InvalidCredentialsException;
import com.collaborative.editor.exception.userException.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("AuthenticationServiceImpl")
public class AuthenticationServiceImpl implements AuthenticationService{

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthenticationServiceImpl(@Lazy AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }


    @Override
    public String verify(LoginRequest loginRequest) {
        Authentication authentication = authenticateUser(loginRequest);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtUtil.generateToken(authentication);
    }


    private Authentication authenticateUser(LoginRequest loginRequest) {
        try {
            return authManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (UsernameNotFoundException ex) {
            throw new UserNotFoundException("User not found with email: " + loginRequest.getEmail());
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
    }

}
