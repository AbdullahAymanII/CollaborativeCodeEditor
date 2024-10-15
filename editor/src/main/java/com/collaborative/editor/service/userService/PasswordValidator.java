package com.collaborative.editor.service.userService;

import java.util.Arrays;
import java.util.List;

public class PasswordValidator {

    private static final int MIN_LENGTH = 8;
    private static final List<String> COMMON_PASSWORDS = Arrays.asList("password", "123456", "qwerty", "admin");

    public static void validatePassword(String password, String username, String email) {
        if (password.length() < MIN_LENGTH) {
            throw new IllegalArgumentException("Password must be at least " + MIN_LENGTH + " characters long.");
        }

        if (!containsUpperCase(password)) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter.");
        }

        if (!containsLowerCase(password)) {
            throw new IllegalArgumentException("Password must contain at least one lowercase letter.");
        }

        if (!containsDigit(password)) {
            throw new IllegalArgumentException("Password must contain at least one digit.");
        }

        if (!containsSpecialCharacter(password)) {
            throw new IllegalArgumentException("Password must contain at least one special character.");
        }

        if (COMMON_PASSWORDS.contains(password.toLowerCase())) {
            throw new IllegalArgumentException("Password is too common. Choose a stronger password.");
        }

        if (password.contains(username) || password.contains(email)) {
            throw new IllegalArgumentException("Password should not contain personal information like your username or email.");
        }
    }

    private static boolean containsUpperCase(String password) {
        return password.chars().anyMatch(Character::isUpperCase);
    }

    private static boolean containsLowerCase(String password) {
        return password.chars().anyMatch(Character::isLowerCase);
    }

    private static boolean containsDigit(String password) {
        return password.chars().anyMatch(Character::isDigit);
    }

    private static boolean containsSpecialCharacter(String password) {
        return password.chars().anyMatch(ch -> "!@#$%^&*()_+{}[]|:;<>,.?/~`-=".indexOf(ch) >= 0);
    }
}

