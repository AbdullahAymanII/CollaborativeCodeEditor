//package com.collaborative.editor.controller.user;
//
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/user")
//public class UserController {
//
//    @GetMapping("/info")
//    public Map<String, Object> getUserInfo() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
//        Object principal = authentication.getPrincipal();
//        String username = switch (principal) {
//            case UserDetails userDetails -> userDetails.getUsername();
//            case DefaultOidcUser oidcUser -> oidcUser.getEmail();
//            case OAuth2User oauth2User -> oauth2User.getAttribute("login");
//            case null, default -> throw new IllegalArgumentException("Unsupported authentication principal type");
//        };
//
//        // Creating a response map to hold user data (You can add more user details here)
//        Map<String, Object> response = new HashMap<>();
//        response.put("username", username);
//        response.put("profileImage", "https://i.pinimg.com/originals/c6/29/0c/c6290cbd497e76e536931568aefd8b60.png"); // Replace with actual URL
//
//        return response;
//    }
//}


package com.collaborative.editor.controller.user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/info")
    public Map<String, Object> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalArgumentException("No authentication found or invalid principal");
        }

        Object principal = authentication.getPrincipal();
        String username = extractUsername(principal);
        String profileImage = "https://i.pinimg.com/originals/c6/29/0c/c6290cbd497e76e536931568aefd8b60.png"; // Replace with actual URL

        // Creating a response map to hold user data
        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("profileImage", profileImage);

        return response;
    }

    private String extractUsername(Object principal) {
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        } else if (principal instanceof DefaultOidcUser oidcUser) {
            return oidcUser.getEmail();
        } else if (principal instanceof OAuth2User oauth2User) {
            return oauth2User.getAttribute("login");
        } else {
            throw new IllegalArgumentException("Unsupported authentication principal type");
        }
    }
}
