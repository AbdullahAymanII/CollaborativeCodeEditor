package com.collaborative.editor.service.userService;

import com.collaborative.editor.repository.mysql.UserRepository;
import com.collaborative.editor.exception.userException.UserNotFoundException;
import com.collaborative.editor.model.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setPassword("Apasswo@rd123");
    }

    @Test
    void createUserSuccess() {

        when(userRepository.findOneByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(user)).thenReturn(user);

        userService.createUser(user);

        verify(userRepository, times(1)).save(user);
    }

    @Test
    void createUserAlreadyExists() {

        when(userRepository.findOneByEmail(user.getEmail())).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> userService.createUser(user));
    }

    @Test
    void getUserByEmailSuccess() {

        when(userRepository.findOneByEmail(user.getEmail())).thenReturn(Optional.of(user));

        Optional<User> result = userService.findUserByEmail(user.getEmail());

        assertTrue(result.isPresent());
        assertEquals(user.getEmail(), result.get().getEmail());
    }

    @Test
    void findUserByUsernameSuccess() {

        when(userRepository.findOneByUsername(user.getUsername())).thenReturn(user);

        User result = userService.findUserByUsername(user.getUsername());

        assertEquals(user.getUsername(), result.getUsername());
    }

    @Test
    void findUserByUsernameNotFound() {

        when(userRepository.findOneByUsername(user.getUsername())).thenThrow(new UserNotFoundException("User not found"));

        assertThrows(RuntimeException.class, () -> userService.findUserByUsername(user.getUsername()));
    }
}