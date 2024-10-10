package com.collaborative.editor.database.dto.file;


import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileDTO {
    private String filename;
    private String roomId;
    private String projectName;
    private String extension;
}
