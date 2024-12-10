package com.collaborative.editor.dto.file;


import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileDTO {
    private String filename;
    private String roomId;
    private String projectName;
    private String extension;
}
