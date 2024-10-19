package com.collaborative.editor.controller.websocket;

import com.collaborative.editor.dto.code.CodeDTO;
import com.collaborative.editor.model.messageLog.MessageLog;

import com.collaborative.editor.service.editorService.EditorService;
import com.collaborative.editor.service.messageLogsService.LogsService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Controller
public class WebsocketController {

    private final EditorService editorService;

    private final LogsService logService;

    private final Map<String, Object> lineLocks = new ConcurrentHashMap<>();

    public WebsocketController(@Qualifier("EditorServiceImpl") EditorService editorService,
                               @Qualifier("LogsServiceImpl") LogsService logService) {
        this.editorService = editorService;
        this.logService = logService;
    }

    //    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}/COLLABORATOR")
    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
    public CodeDTO handleCollaboratorCode(
            @DestinationVariable String roomId,
            @DestinationVariable String projectName,
            @DestinationVariable String filename,
            @Payload CodeDTO codeDTO) {


        String lineKey = roomId + "-" + projectName + "-" + filename + "-" + codeDTO.getLineNumber();

        synchronized (getLineLock(lineKey)) {
            return codeDTO;
        }
    }

    private Object getLineLock(String lineKey) {
        return lineLocks.computeIfAbsent(lineKey, k -> new Object());
    }

//    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}/COLLABORATOR")
//    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
//    public CodeDTO handleCollaboratorCode(
//            @DestinationVariable String roomId,
//            @DestinationVariable String projectName,
//            @DestinationVariable String filename,
//            @Payload CodeDTO codeDTO) {
//
//        String lineKey = generateLineKey(roomId, projectName, filename, codeDTO.getLineNumber());
//        String currentUserId = codeDTO.getUserId();
//
//        if (lineLocks.containsKey(lineKey)) {
//            String lockedBy = lineLocks.get(lineKey);
//
//            if (!lockedBy.equals(currentUserId)) {
//                codeDTO.setLineContent("Conflict: Line " + codeDTO.getLineNumber() + " is being edited by another user.");
//                return codeDTO;
//            }
//
//        }
//
//        lineLocks.put(lineKey, currentUserId);
//
//        CodeDTO updatedCode = editorService.insertComment(codeDTO);
//
//        lineLocks.remove(lineKey);
//
//        return updatedCode;
//    }


    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}/VIEWER")
    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
    public CodeDTO handleViewerCode(
            @DestinationVariable String roomId,
            @DestinationVariable String projectName,
            @DestinationVariable String filename,
            @Payload CodeDTO codeDTO) {

        System.out.println("Received code update for room: " + roomId
                + ", project: " + projectName
                + ", filename: " + filename
                + ", role: " + "VIEWER");

        return editorService.insertComment(codeDTO);
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
}


