package com.collaborative.editor.controller.editor.websocket;
import com.collaborative.editor.model.codeUpdate.CodeUpdate;
import com.collaborative.editor.model.messageLog.MessageLog;
import com.collaborative.editor.service.editorService.EditorService;
import com.collaborative.editor.service.LogsService.LogsService;
import com.collaborative.editor.service.roomMembershipService.RoomSecurityService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;

@Controller
public class WebsocketController {

    private final ExecutorService executorService;
    private final EditorService editorService;
    private final LogsService logService;
    private final Map<String, Object> lineLocks = new ConcurrentHashMap<>();
    private final RoomSecurityService roomSecurityService;

    public WebsocketController(@Qualifier("EditorServiceImpl") EditorService editorService,
                               @Qualifier("LogsServiceImpl") LogsService logService,
                               @Qualifier("webSocketExecutorService") ExecutorService executorService,
                               RoomSecurityService roomSecurityService
    ) {
        this.editorService = editorService;
        this.logService = logService;
        this.executorService = executorService;
        this.roomSecurityService = roomSecurityService;
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


    @MessageMapping("/code/updates/{roomId}/{projectName}/{filename}/VIEWER")
    @SendTo("/topic/file/updates/{roomId}/{projectName}/{filename}")
    public CodeUpdate handleViewerComment(
            @DestinationVariable String roomId,
            @DestinationVariable String projectName,
            @DestinationVariable String filename,
            @Payload CodeUpdate codeUpdate) {


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
