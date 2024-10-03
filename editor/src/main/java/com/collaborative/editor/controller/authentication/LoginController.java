package com.collaborative.editor.controller.authentication;

import com.collaborative.editor.service.userService.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/log-in")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Map<String, String> response = new HashMap<>();
        String token = userService.verify(email, password);

        if (token.equals("Invalid credentials")) {
            response.put("message", "Invalid email or password");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        } else if (token.equals("Authentication failed")) {
            response.put("message", "Login failed, please try again");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
        response.put("token", token);
        response.put("message", "Login successful");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
