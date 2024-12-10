package com.collaborative.editor.dto.project;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private String projectName;
    private String roomId;
}
