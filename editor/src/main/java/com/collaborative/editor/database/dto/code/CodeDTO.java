package com.collaborative.editor.database.dto.code;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeDTO {
    private String userId;
    private String filename;
    private String roomId;
    private String projectName;
    private String code;
}
