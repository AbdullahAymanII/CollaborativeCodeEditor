package com.collaborative.editor.dto.authentication;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    private String email;
    private String password;
}
