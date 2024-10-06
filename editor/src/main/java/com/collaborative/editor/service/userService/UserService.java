package com.collaborative.editor.service.userService;

import com.collaborative.editor.model.mysql.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public interface UserService {
    boolean createUser(User user);
    Optional<User> findUserByEmail(String email);
    User findUserByUsername(String username);
    boolean updateUserPassword(User user);
    boolean updateUserEmail(User user);
    boolean updateUserUserName(User user);
    boolean updateUserRole(User user);
    boolean deleteUser(User user);
    String verify(String username, String password);
    User getUser(Authentication authentication) throws UsernameNotFoundException;
}
