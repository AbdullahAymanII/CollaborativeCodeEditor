package com.collaborative.editor.model.mysql.file;


import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeRequestDTO {
    private String language;
    private String code;
}

