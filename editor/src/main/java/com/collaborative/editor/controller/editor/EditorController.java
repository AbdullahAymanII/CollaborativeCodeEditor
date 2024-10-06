package com.collaborative.editor.controller.editor;

import com.collaborative.editor.model.mysql.code.CodeDTO;
import com.collaborative.editor.model.mysql.message.ChatMessageDTO;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;


@Controller
public class EditorController {

    @MessageMapping("/code/updates")
    @SendTo("/topic/file/updates")
    public CodeDTO handleCollaboratorCode(@Payload CodeDTO codeDTO) {
        System.out.println("Collaborator update for file: " + codeDTO.getFilename());
        return codeDTO;
    }

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageDTO handleChatMessage(@DestinationVariable("roomId") String roomId, @Payload ChatMessageDTO chatMessageDTO) {
        System.out.println("New chat message in room " + roomId + " from " + chatMessageDTO.getSender() + ": " + chatMessageDTO.getContent());
        return chatMessageDTO;
    }
}

