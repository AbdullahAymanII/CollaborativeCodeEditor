package com.collaborative.editor.controller.editor;

import com.collaborative.editor.model.mongodb.Comment;
import com.collaborative.editor.model.mysql.file.CodeDTO;
import com.collaborative.editor.model.mysql.file.CursorDTO;
import com.collaborative.editor.service.editorService.CommentServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
@Controller
public class EditorController {

    @MessageMapping("/code/updates")
    @SendTo("/topic/file/updates")
    public CodeDTO sendCode(@Payload CodeDTO codeDTO) {
        System.out.println("Received code update for file: " + codeDTO.getFilename());
        return codeDTO;
    }

    @MessageMapping("/cursor/{filename}")
    @SendTo("/topic/file/{filename}")
    public CursorDTO sendCursor(@DestinationVariable String filename, @Payload CursorDTO cursorDTO) {
        System.out.println("Received cursor update for file: " + filename);
        return cursorDTO;
    }

}

