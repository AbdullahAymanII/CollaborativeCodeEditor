package com.collaborative.editor.model.mysql.code;


import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeRequestDTO {
    private String language;
    private String code;
    private String input;
}

