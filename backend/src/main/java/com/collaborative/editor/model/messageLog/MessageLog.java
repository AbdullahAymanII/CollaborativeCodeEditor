package com.collaborative.editor.model.messageLog;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "messageLogs")
public class MessageLog {
    private String sender;
    private String role;
    private String filename;
    private String roomId;
    private String projectName;
    private String content;
    private Long timestamp;
    private String type;
}
