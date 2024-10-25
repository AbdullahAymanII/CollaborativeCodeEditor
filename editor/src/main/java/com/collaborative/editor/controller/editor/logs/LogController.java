package com.collaborative.editor.controller.editor.logs;

import com.collaborative.editor.dto.project.ProjectDTO;
import com.collaborative.editor.model.messageLog.MessageLog;
import com.collaborative.editor.service.LogsService.LogsService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/viewer")
@CrossOrigin
public class LogController {


    private final LogsService logService;

    public LogController(@Qualifier("LogsServiceImpl") LogsService logService) {
        this.logService = logService;
    }

    @GetMapping("/room/{roomId}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getRoomLogs(@PathVariable("roomId") String roomId) {
        try {
            List<MessageLog> roomLogs = logService.getLogsByRoomId(roomId).get();
            return ResponseEntity.ok(Map.of("roomLogs", roomLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{username}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getUserLogs(@PathVariable("username") String username) {
        try {
            List<MessageLog> roomLogs = logService.getCollaboratorLogs(username).get();
            ;
            return ResponseEntity.ok(Map.of("collaboratorLogs", roomLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/project/{roomId}/{projectName}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getProjectLogs(@PathVariable("projectName") String projectName,
                                                                        @PathVariable("roomId") String roomId) {
        try {
            List<MessageLog> projectLogs;
            projectLogs = logService.getProjectLogs(new ProjectDTO(projectName, roomId)).get();

            return ResponseEntity.ok(Map.of("projectLogs", projectLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/files/{roomId}/{projectName}/{filename}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getFileLogs(@PathVariable("projectName") String projectName,
                                                                     @PathVariable("roomId") String roomId,
                                                                     @PathVariable("filename") String filename) {
        try {
            List<MessageLog> fileLogs;
            fileLogs = logService.getFileLogs(projectName, roomId, filename).get();

            return ResponseEntity.ok(Map.of("projectLogs", fileLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/files/{roomId}/{type}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getActionLogs(@PathVariable("type") String type,
                                                                       @PathVariable("roomId") String roomId) {
        try {
            List<MessageLog> actionLogs;
            actionLogs = logService.getLogsByActionType(type, roomId).get();

            return ResponseEntity.ok(Map.of("actionLogs", actionLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}