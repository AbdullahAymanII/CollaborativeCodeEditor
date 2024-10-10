package com.collaborative.editor.database.dto.code;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecution {
    private String language;
    private String code;
    private String input;
}

