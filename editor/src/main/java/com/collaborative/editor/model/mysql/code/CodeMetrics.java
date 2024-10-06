package com.collaborative.editor.model.mysql.code;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeMetrics {
    private int lines;
    private int functions;
    private int variables;
    private int cyclomaticComplexity;
}
