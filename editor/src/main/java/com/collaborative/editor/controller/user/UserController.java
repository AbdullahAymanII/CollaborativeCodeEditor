
package com.collaborative.editor.controller.user;

import com.collaborative.editor.configuration.jwt.JwtUtil;
import com.collaborative.editor.model.mysql.user.User;
import com.collaborative.editor.service.userService.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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

    private final UserServiceImpl userService;
    private final JwtUtil jwtUtil;

    private static final String DEFAULT_PROFILE_IMAGE = "https://i.pinimg.com/originals/c6/29/0c/c6290cbd497e76e536931568aefd8b60.png";

    @Autowired
    public UserController(@Qualifier("UserServiceImpl") UserServiceImpl userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/info")
    public Map<String, Object> getAuthenticatedUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalArgumentException("No authentication found or invalid principal");
        }

        User user = userService.getUser(authentication);

        return buildUserInfoResponse(user);
    }

    private Map<String, Object> buildUserInfoResponse(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getEmail());
        response.put("profileImage", DEFAULT_PROFILE_IMAGE);

        return response;
    }
}