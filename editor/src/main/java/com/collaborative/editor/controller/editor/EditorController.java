package com.collaborative.editor.controller.editor;

import com.collaborative.editor.model.mysql.code.CodeDTO;
import com.collaborative.editor.model.mysql.message.ChatMessageDTO;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;


@Controller
public class EditorController {

    @MessageMapping("/code/updates")
    @SendTo("/topic/file/updates")
//    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public CodeDTO handleCollaboratorCode(@Payload CodeDTO codeDTO) {
        System.out.println("Collaborator update for file: " + codeDTO.getFilename());
        return codeDTO;
    }

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageDTO handleChatMessage(@DestinationVariable("roomId") String roomId, @Payload ChatMessageDTO chatMessageDTO) {
        chatMessageDTO.setTimestamp(System.currentTimeMillis());
        System.out.println("@MessageMapping(\"/chat/{roomId}\")");
        System.out.println(chatMessageDTO);
        return chatMessageDTO;
    }

    @MessageMapping("/user/join/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageDTO handleUserJoin(@DestinationVariable("roomId") String roomId, @Payload ChatMessageDTO chatMessageDTO) {
        chatMessageDTO.setContent(" has joined the room.");
        chatMessageDTO.setTimestamp(System.currentTimeMillis());
        return chatMessageDTO;
    }

    @MessageMapping("/user/leave/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageDTO handleUserLeave(@DestinationVariable("roomId") String roomId, @Payload ChatMessageDTO chatMessageDTO) {
        chatMessageDTO.setContent(" has left the room.");
        chatMessageDTO.setTimestamp(System.currentTimeMillis());
        return chatMessageDTO;
    }
}


