package com.collaborative.editor.controller.executor;


import com.collaborative.editor.database.dto.code.CodeExecution;
import com.collaborative.editor.service.dockerService.DockerExecutorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/execute")
public class ExecutionController {

    private final DockerExecutorService dockerService;

    public ExecutionController(DockerExecutorService dockerService) {
        this.dockerService = dockerService;
    }

    @PostMapping("/run")
    public  ResponseEntity<Map<String, String>>  runCode(@RequestBody CodeExecution codeRequest) {
        try {
            String output = dockerService.executeCode(codeRequest);
            return ResponseEntity.ok(Map.of("output", output));
        } catch (Exception e) {
            return ResponseEntity.noContent().build();
        }
    }
}