package com.collaborative.editor.controller.editor;

import com.collaborative.editor.model.mysql.code.CodeDTO;
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
}
