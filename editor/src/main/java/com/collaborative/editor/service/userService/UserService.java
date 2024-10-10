package com.collaborative.editor.service.userService;

import com.collaborative.editor.model.mysql.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public interface UserService {
    void createUser(User user);
    Optional<User> findUserByEmail(String email);
    User findUserByUsername(String username);
    User getUser(Authentication authentication) throws UsernameNotFoundException;
}
