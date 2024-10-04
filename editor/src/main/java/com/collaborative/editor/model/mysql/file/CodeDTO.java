package com.collaborative.editor.model.mysql.file;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeDTO {
    private String userId;
    private String filename;
    private Long roomId;
    private String projectName;
    private String code;
}
