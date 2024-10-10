package com.collaborative.editor.controller.authentication;

import com.collaborative.editor.database.dto.authentication.LoginRequest;
import com.collaborative.editor.database.dto.authentication.LoginResponse;
import com.collaborative.editor.exception.InvalidCredentialsException;
import com.collaborative.editor.exception.UserNotFoundException;
import com.collaborative.editor.service.authService.AuthenticationServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin
@RequestMapping("/api")
public class SignInController {

    @Autowired
    private AuthenticationServiceImpl authenticationService;

    @PostMapping("/sign-in")
    public ResponseEntity<LoginResponse> signIn(@RequestBody LoginRequest loginRequest) {
        try {
            String token = authenticationService.verify(loginRequest);
            return buildResponse(token, "Login successful", HttpStatus.OK);
        } catch (InvalidCredentialsException e) {
            return buildResponse(null, e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (UserNotFoundException e) {
            return buildResponse(null, e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return buildResponse(null, "Login failed, please try again", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    private ResponseEntity<LoginResponse> buildResponse(String token, String message, HttpStatus status) {
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setMessage(message);
        return new ResponseEntity<>(response, status);
    }
}
