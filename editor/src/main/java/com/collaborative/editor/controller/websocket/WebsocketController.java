//package com.collaborative.editor.controller.websocket;
//
//import com.collaborative.editor.dto.code.CodeDTO;
//import com.collaborative.editor.model.messageLog.MessageLog;
//
//import com.collaborative.editor.service.editorService.EditorService;
//import com.collaborative.editor.service.messageLogsService.LogsService;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.messaging.handler.annotation.*;
//import org.springframework.stereotype.Controller;
//
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//
//@Controller
//public class WebsocketController {
//
//    private final EditorService editorService;
//
//    private final LogsService logService;
//
//    private final Map<String, Object> lineLocks = new ConcurrentHashMap<>();
//
//    public WebsocketController(@Qualifier("EditorServiceImpl") EditorService editorService,
//                               @Qualifier("LogsServiceImpl") LogsService logService) {
//        this.editorService = editorService;
//        this.logService = logService;
//    }
//
//    //    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
//    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}/COLLABORATOR")
//    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
//    public CodeDTO handleCollaboratorCode(
//            @DestinationVariable String roomId,
//            @DestinationVariable String projectName,
//            @DestinationVariable String filename,
//            @Payload CodeDTO codeDTO) {
//
//
//        String lineKey = roomId + "-" + projectName + "-" + filename + "-" + codeDTO.getLineNumber();
//
//        synchronized (getLineLock(lineKey)) {
//            return codeDTO;
//        }
//    }
//
//    private Object getLineLock(String lineKey) {
//        return lineLocks.computeIfAbsent(lineKey, k -> new Object());
//    }
//
//
//
//    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}/VIEWER")
//    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
//    public CodeDTO handleViewerCode(
//            @DestinationVariable String roomId,
//            @DestinationVariable String projectName,
//            @DestinationVariable String filename,
//            @Payload CodeDTO codeDTO) {
//
//        System.out.println("Received code update for room: " + roomId
//                + ", project: " + projectName
//                + ", filename: " + filename
//                + ", role: " + "VIEWER");
//
//        return editorService.insertComment(codeDTO);
//    }
//
//    @MessageMapping("/chat/{roomId}")
//    @SendTo("/topic/chat/{roomId}")
//    public MessageLog handleChatMessage(@DestinationVariable("roomId") String roomId,
//                                        @Payload MessageLog messageLog) {
//
//        messageLog.setTimestamp(System.currentTimeMillis());
//
//        if (!messageLog.getType().equalsIgnoreCase("message"))
//            logService.saveLog(messageLog);
//        return messageLog;
//    }
//}
//
//


package com.collaborative.editor.controller.websocket;

import com.collaborative.editor.dto.code.CodeDTO;
import com.collaborative.editor.model.codeUpdate.CodeUpdate;
import com.collaborative.editor.model.messageLog.MessageLog;
import com.collaborative.editor.service.editorService.EditorService;
import com.collaborative.editor.service.messageLogsService.LogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;

@Controller
public class WebsocketController {

    private final EditorService editorService;
    private final LogsService logService;
    private final Map<String, Object> lineLocks = new ConcurrentHashMap<>();
    private final ExecutorService executorService;

    public WebsocketController(@Qualifier("EditorServiceImpl") EditorService editorService,
                               @Qualifier("LogsServiceImpl") LogsService logService,
                               @Qualifier("webSocketExecutorService") ExecutorService executorService
    ) {
        this.editorService = editorService;
        this.logService = logService;
        this.executorService = executorService;
    }

    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}/COLLABORATOR")
    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
    public CodeUpdate handleCollaboratorCode(
            @DestinationVariable String roomId,
            @DestinationVariable String projectName,
            @DestinationVariable String filename,
            @Payload CodeUpdate codeUpdate) {

        String lineKey = roomId + "-" + projectName + "-" + filename + "-" + codeUpdate.getLineNumber();

        executorService.submit(() -> {
            synchronized (getLineLock(lineKey)) {
                editorService.saveCodeUpdate(codeUpdate);
            }
        });

        return codeUpdate;
    }

    // Handling code updates from viewers (comments) remains unchanged
    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}/VIEWER")
    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
    public CodeUpdate handleViewerCode(
            @DestinationVariable String roomId,
            @DestinationVariable String projectName,
            @DestinationVariable String filename,
            @Payload CodeUpdate codeUpdate) {

        System.out.println("Received code update for room: " + roomId
                + ", project: " + projectName
                + ", filename: " + filename
                + ", role: " + "VIEWER");

        String lineKey = roomId + "-" + projectName + "-" + filename + "-" + codeUpdate.getLineNumber();

        codeUpdate = editorService.insertComment(codeUpdate);
        CodeUpdate finalCodeUpdate = codeUpdate;

        executorService.submit(() -> {
            synchronized (getLineLock(lineKey)) {
                editorService.saveCodeUpdate(finalCodeUpdate);
            }
        });

        return finalCodeUpdate;
    }

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public MessageLog handleChatMessage(@DestinationVariable("roomId") String roomId,
                                        @Payload MessageLog messageLog) {

        messageLog.setTimestamp(System.currentTimeMillis());
        executorService.submit(() -> {
            if (!messageLog.getType().equalsIgnoreCase("message")) {
                logService.saveLog(messageLog);
            }
        });

        return messageLog;
    }

    private Object getLineLock(String lineKey) {
        return lineLocks.computeIfAbsent(lineKey, k -> new Object());
    }
}
