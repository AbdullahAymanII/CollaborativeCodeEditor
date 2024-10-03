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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

//@RestController
//@CrossOrigin
//public class EditorController {
//
////    private final CommentServiceImpl commentService;
////
////    public EditorController(@Qualifier("CommentServiceImpl") CommentServiceImpl commentService) {
////        this.commentService = commentService;
////    }
//
////    @MessageMapping("/comment") // The client sends comments here
////    @SendTo("/editor/comments")  // Broadcast to all subscribers
////    public Comment handleComment(Comment comment) {
////        // This could involve saving the comment, but we'll broadcast it for now
////        try {
////            comment.setTimestamp(LocalDateTime.parse(String.valueOf(System.currentTimeMillis())));
////            commentService.saveComment(comment);  // Save the comment to the database
////            return comment;  // Return to send it back to all clients
////        } catch (RuntimeException e) {
////            throw new RuntimeException(e);
////        }
////
////    }
////
////
////    @MessageMapping("/code")
////    @SendTo("/editor/code")
////    public CodeDTO sendCode(CodeDTO codeDTO) {
////        return codeDTO;
////    }
//
////    private SimpMessagingTemplate simpMessageTemplate;
//
////    public EditorController(SimpMessagingTemplate simpMessageTemplate) {
////        this.simpMessageTemplate = simpMessageTemplate;
////    }
//
//    @MessageMapping("/code")
//    @SendTo("/editor/code")
//    public CodeDTO sendCode(@Payload CodeDTO codeDTO) {
//        System.out.println("hekkkkk eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
////        simpMessageTemplate.convertAndSend("/editor/code", codeDTO); // Send code changes to all users
//        return codeDTO; // Send code changes to all users
//    }
//
////    @MessageMapping("/cursor")
////    @SendTo("/editor/cursor")
////    public CursorDTO sendCursor(@Payload CursorDTO cursorDTO) {
////        simpMessageTemplate.convertAndSend("/editor/cursor", cursorDTO); // Send cursor updates to all users
////        return cursorDTO; // Send cursor updates to all users
////    }
//
//}


//@Controller
//public class EditorController {
//
//    @MessageMapping("/code")
//    @SendTo("/topic/code")
//    public CodeDTO sendCode(@Payload CodeDTO codeDTO) {
//        System.out.println("Received code update: " + codeDTO);
//        return codeDTO; // Broadcast code changes to all clients subscribed to /topic/code
//    }
//
//    @MessageMapping("/cursor")
//    @SendTo("/topic/cursor")
//    public CursorDTO sendCursor(@Payload CursorDTO cursorDTO) {
//        System.out.println("Received cursor update: " + cursorDTO);
//        return cursorDTO; // Broadcast cursor updates to all clients subscribed to /topic/cursor
//    }
//}
@Controller
public class EditorController {

    @MessageMapping("/code/{filename}")
    @SendTo("/topic/file/{filename}")
    public CodeDTO sendCode(@DestinationVariable String filename, @Payload CodeDTO codeDTO) {
        System.out.println("Received code update for file: " + filename);
        return codeDTO;
    }

    @MessageMapping("/cursor/{filename}")
    @SendTo("/topic/file/{filename}")
    public CursorDTO sendCursor(@DestinationVariable String filename, @Payload CursorDTO cursorDTO) {
        System.out.println("Received cursor update for file: " + filename);
        return cursorDTO;
    }
}
