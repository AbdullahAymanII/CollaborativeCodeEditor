package com.collaborative.editor.dto.code;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeDTO {
    private String userId;
    private String filename;
    private String roomId;
    private String projectName;
    private String lineNumber;
    private String column;
    private String lineContent;
    private String code;
}
