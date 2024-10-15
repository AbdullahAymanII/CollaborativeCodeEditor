package com.collaborative.editor.dto.authentication;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String message;
}
