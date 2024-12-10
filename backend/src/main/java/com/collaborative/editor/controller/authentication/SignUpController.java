package com.collaborative.editor.controller.authentication;

import com.collaborative.editor.model.user.User;
import com.collaborative.editor.service.userService.UserService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class SignUpController {

    private final UserService userService;

    public SignUpController(@Qualifier("UserServiceImpl") UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/sign-up")
    public ResponseEntity<Map<String, String>> createAccount(@RequestBody User user) {
        try {
            userService.createUser(user);
            return buildResponse("Account created successfully", HttpStatus.OK);

        } catch (IllegalArgumentException e) {

            return buildResponse(e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            return buildResponse("Registration failed, please try again", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/sign-in/provider/{provider}")
    public RedirectView providerSignIn(@PathVariable String provider) {
        return new RedirectView("/oauth2/authorization/" + provider);
    }

    private ResponseEntity<Map<String, String>> buildResponse(String message, HttpStatus status) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return new ResponseEntity<>(response, status);
    }

}