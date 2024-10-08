package com.collaborative.editor.controller.editor;

import com.collaborative.editor.model.mongodb.MessageLog;
import com.collaborative.editor.model.mysql.code.CodeMetrics;
import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.collaborative.editor.service.editorService.EditorServiceImpl;
import com.collaborative.editor.service.messageLogsService.LogsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/viewer")
@CrossOrigin
public class ViewController {

    private final EditorServiceImpl editorService;

    @Autowired
    private LogsServiceImpl logService;

    public ViewController(@Qualifier("EditorServiceImpl") EditorServiceImpl editorService) {
        this.editorService = editorService;
    }

    @PostMapping("/CodeMetrics")
    public ResponseEntity<Map<String, CodeMetrics>> getCodeMetrics(@RequestBody Map<String, String> request) {
        try {
            CodeMetrics metrics = editorService.calculateMetrics(request.get("code"), request.get("language"));
            return ResponseEntity.ok(Map.of("metrics", metrics));
        }catch (Exception e){
            return ResponseEntity.unprocessableEntity().build();
        }
    }

    @GetMapping("/room/{roomId}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getRoomLogs(@PathVariable("roomId") Long roomId) {
        try {
            List<MessageLog>  roomLogs = logService.getLogsByRoomId(roomId).get();
            return ResponseEntity.ok(Map.of("roomLogs", roomLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{username}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getUserLogs(@PathVariable("username") String username) {
        try {
            List<MessageLog>  roomLogs = logService.getCollaboratorLogs(username).get();;
            return ResponseEntity.ok(Map.of("collaboratorLogs", roomLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/project/{roomId}/{projectName}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getProjectLogs(@PathVariable("projectName") String projectName,
                                                                        @PathVariable("roomId")  Long roomId) {
        try {
            List<MessageLog>  projectLogs;
            projectLogs = logService.getProjectLogs(new ProjectDTO(projectName, roomId)).get();

            return ResponseEntity.ok(Map.of("projectLogs", projectLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/files/{roomId}/{projectName}/{filename}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getFileLogs(@PathVariable("projectName") String projectName,
                                                                     @PathVariable("roomId")  Long roomId,
                                                                     @PathVariable("filename") String filename)
    {
        try {
            List<MessageLog>  fileLogs;
            fileLogs = logService.getFileLogs(new FileDTO(filename, roomId, projectName)).get();

            return ResponseEntity.ok(Map.of("projectLogs", fileLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/files/{roomId}/{type}/logs")
    public ResponseEntity<Map<String, List<MessageLog>>> getActionLogs(@PathVariable("type") String type, @PathVariable("roomId")  Long roomId) {
        try {
            List<MessageLog>  actionLogs;
            actionLogs = logService.getLogsByActionType(type, roomId).get();

            return ResponseEntity.ok(Map.of("actionLogs", actionLogs));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}