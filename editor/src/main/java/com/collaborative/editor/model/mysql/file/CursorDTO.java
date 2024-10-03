package com.collaborative.editor.model.mysql.file;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CursorDTO {
    private String userId;
    private int lineNumber;
//    private String username;
}

