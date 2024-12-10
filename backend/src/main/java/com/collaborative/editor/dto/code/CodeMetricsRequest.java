package com.collaborative.editor.dto.code;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeMetricsRequest {
    private String code;
    private String language;
}
