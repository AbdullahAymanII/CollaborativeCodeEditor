package com.collaborative.editor.model.mysql.file;


import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FileDTO {
    private String fileName;
    private Long roomId;
    private String projectName;
}
