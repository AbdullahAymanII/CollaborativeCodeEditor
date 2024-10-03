package com.collaborative.editor.model.mysql.project;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private String projectName;
    private Long roomId;
}
