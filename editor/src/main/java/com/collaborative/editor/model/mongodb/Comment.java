package com.collaborative.editor.model.mongodb;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "comments")
public class Comment {

    private Long roomId;

    private String projectName;

    private Long lineNumber;

    private String viewerEmail;

    private String content;

    private LocalDateTime timestamp;

}
