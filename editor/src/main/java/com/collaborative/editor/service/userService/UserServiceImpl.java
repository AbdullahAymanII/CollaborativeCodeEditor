package com.collaborative.editor.service.userService;


import com.collaborative.editor.configuration.jwt.JwtUtil;
import com.collaborative.editor.database.mysql.UserRepository;
import com.collaborative.editor.exception.UserNotFoundException;
import com.collaborative.editor.model.mysql.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("UserServiceImpl")
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
//    private final JWTService jwtService;
    private final AuthenticationManager authManager;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil ;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, @Lazy AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
//        this.jwtService = jwtService;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean createUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user) != null;
    }

    @Override
    public String verify(String username, String password) {
        try {
            Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

            if (authentication.isAuthenticated()) {
                SecurityContextHolder.getContext().setAuthentication(authentication);

                return jwtUtil.generateToken(authentication);
            }
        } catch (UsernameNotFoundException ex) {
            throw new UserNotFoundException("User not found with email: " + username);
        } catch (BadCredentialsException ex) {
            return "Invalid credentials";
        }
        return "Authentication failed";
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findOneByEmail(email);
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findOneByUsername(username);
    }

    @Override
    public boolean updateUserPassword(User user) {
        return userRepository.save(user) != null;
    }

    @Override
    public boolean updateUserEmail(User user) {
        return userRepository.save(user) != null;
    }

    @Override
    public boolean updateUserUserName(User user) {
        return userRepository.save(user) != null;
    }

    @Override
    public boolean updateUserRole(User user) {
        return userRepository.save(user) != null;
    }

    @Override
    public boolean deleteUser(User user) {
        userRepository.delete(user);
        return true;
    }
}
