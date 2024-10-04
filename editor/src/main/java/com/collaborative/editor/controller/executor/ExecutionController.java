package com.collaborative.editor.controller.executor;


import com.collaborative.editor.model.mysql.file.CodeRequestDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.collaborative.editor.service.dockerService.DockerExecutorService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public  ResponseEntity<Map<String, String>>  runCode(@RequestBody CodeRequestDTO codeRequest) {
        String language = codeRequest.getLanguage();
        String code = codeRequest.getCode();
        System.out.println(language+"    "+code+" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        try {
            String output = dockerService.executeCode(language, code);
            System.out.println(" ++++++++++++++++++++++++++++++++++++++++++++++++++++++++ ++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            System.out.println(output);

            return ResponseEntity.ok(Map.of("output", output));
        } catch (Exception e) {
            return ResponseEntity.noContent().build();
        }
    }
}