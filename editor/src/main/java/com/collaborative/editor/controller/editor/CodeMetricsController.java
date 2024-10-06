package com.collaborative.editor.controller.editor;

import com.collaborative.editor.model.mysql.code.CodeMetrics;
import com.collaborative.editor.service.editorService.EditorServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/code-metrics")
@CrossOrigin
public class CodeMetricsController {

    private final EditorServiceImpl editorService;

    public CodeMetricsController(@Qualifier("EditorServiceImpl") EditorServiceImpl editorService) {
        this.editorService = editorService;
    }

    @PostMapping("/VIEWER_STATUS")
    public ResponseEntity<Map<String, CodeMetrics>> getCodeMetrics(@RequestBody Map<String, String> request) {
        try {
            CodeMetrics metrics = editorService.calculateMetrics(request.get("code"), request.get("language"));
            return ResponseEntity.ok(Map.of("metrics", metrics));
        }catch (Exception e){
            return ResponseEntity.unprocessableEntity().build();
        }
    }
}