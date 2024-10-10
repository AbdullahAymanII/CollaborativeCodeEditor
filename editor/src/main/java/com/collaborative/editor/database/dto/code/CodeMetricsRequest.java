package com.collaborative.editor.database.dto.code;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeMetricsRequest {
    private String code;
    private String language;
}
