package com.collaborative.editor.controller.websocket;

import com.collaborative.editor.database.dto.code.CodeDTO;
import com.collaborative.editor.model.mongodb.MessageLog;

import com.collaborative.editor.service.messageLogsService.LogsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;


@Controller
public class WebsocketController {

    @Autowired
    private LogsServiceImpl logService;

    //    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}")
    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
    public CodeDTO handleCollaboratorCode(
            @DestinationVariable String roomId,
            @DestinationVariable String projectName,
            @DestinationVariable String filename,
            @Payload CodeDTO codeDTO) {

        System.out.println("Received code update for room: " + roomId
                + ", project: " + projectName
                + ", filename: " + filename);

        return codeDTO;
    }

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public MessageLog handleChatMessage(@DestinationVariable("roomId") String roomId,
                                        @Payload MessageLog messageLog) {

        messageLog.setTimestamp(System.currentTimeMillis());

        if (!messageLog.getType().equalsIgnoreCase("message"))
            logService.saveLog(messageLog);

        return messageLog;
    }

//    @MessageMapping("/user/join/{roomId}")
//    @SendTo("/topic/chat/{roomId}")
//    public MessageLog handleUserJoin(@DestinationVariable("roomId") String roomId, @Payload MessageLog chatMessageDTO) {
//        chatMessageDTO.setContent(" has joined the room.");
//        chatMessageDTO.setTimestamp(System.currentTimeMillis());
//        return chatMessageDTO;
//    }
//
//    @MessageMapping("/user/leave/{roomId}")
//    @SendTo("/topic/chat/{roomId}")
//    public MessageLog handleUserLeave(@DestinationVariable("roomId") String roomId, @Payload MessageLog chatMessageDTO) {
//        chatMessageDTO.setContent(" has left the room.");
//        chatMessageDTO.setTimestamp(System.currentTimeMillis());
//        return chatMessageDTO;
//    }
}


