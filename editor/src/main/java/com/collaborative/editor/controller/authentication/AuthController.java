package com.collaborative.editor.controller.authentication;

import com.collaborative.editor.model.mysql.user.User;
import com.collaborative.editor.service.userService.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.web.oauth2.login.RedirectionEndpointDsl;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.RedirectViewControllerRegistration;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserServiceImpl userService;


    @PostMapping("/sign-in")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        if(userService.createUser(user)){
            response.put("message", "User Created Successfully");
            response.put("status", "success");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message", "Register failed, please try again");
            response.put("status", "error");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

     @GetMapping("/sign-in/provider/{provider}")
     public RedirectView githubGoogleSignIn(@PathVariable String provider) {
             return new RedirectView("/oauth2/authorization/"+provider);
     }

}