package com.collaborative.editor.dto.code;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeMetrics {
    private int lines;
    private int functions;
    private int variables;
    private int cyclomaticComplexity;
}
