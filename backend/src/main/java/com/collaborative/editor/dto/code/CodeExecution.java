package com.collaborative.editor.dto.code;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeExecution {
    private String language;
    private String code;
    private String input;
}

