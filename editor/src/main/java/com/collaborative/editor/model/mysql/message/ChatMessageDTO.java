package com.collaborative.editor.model.mysql.message;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private String sender;
    private String role;
    private String filename;
    private Long roomId;
    private String projectName;
    private String content;
    private Long timestamp;
}
