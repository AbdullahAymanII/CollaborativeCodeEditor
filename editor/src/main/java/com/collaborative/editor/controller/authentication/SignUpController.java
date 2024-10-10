package com.collaborative.editor.controller.authentication;

import com.collaborative.editor.model.mysql.user.User;
import com.collaborative.editor.service.userService.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class SignUpController {

    @Autowired
    private UserServiceImpl userService;


    @PostMapping("/sign-up")
    public ResponseEntity<String> createAccount(@RequestBody User user) {
        try {
            userService.createUser(user);
            return ResponseEntity.ok("success");
        }catch (Exception e) {
            return new ResponseEntity<>("Registration failed, please try again", HttpStatus.BAD_REQUEST);
        }

    }

     @GetMapping("/sign-in/provider/{provider}")
     public RedirectView githubGoogleSignIn(@PathVariable String provider) {
             return new RedirectView("/oauth2/authorization/"+provider);
     }

}