package com.collaborative.editor.controller.project;

import com.collaborative.editor.model.mongodb.FileVersion;
import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.collaborative.editor.service.fileService.FileServiceImpl;
import com.collaborative.editor.service.projectService.ProjectServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectServiceImpl projectService;

    private final FileServiceImpl fileService;

    public ProjectController(@Qualifier("ProjectServiceImpl") ProjectServiceImpl projectService,@Qualifier("FileServiceImpl") FileServiceImpl fileService) {
        this.projectService = projectService;
        this.fileService = fileService;
    }

    @PostMapping("/create-project")
    public ResponseEntity<String> createProject(@RequestBody Map<String, String> request) {
        String projectName = request.get("projectName");
        String projectDescription = request.get("projectDescription");
        String roomId = request.get("roomId");

        boolean success = projectService.createProject(new ProjectDTO(projectName, Long.parseLong(roomId)), projectDescription);

        if (success) {
            return ResponseEntity.ok("Project created successfully!");
        } else {
            return ResponseEntity.badRequest().body("Failed to create project.");
        }
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<Map<String, List<ProjectDTO>>> listProjects(@PathVariable String roomId) {
        List<ProjectDTO> projects = projectService.getProjects(Long.parseLong(roomId));
        if (projects.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("projects", projects));
    }
//
//    @GetMapping("/{projectName}/{roomId}/files")
//    public ResponseEntity<Map<String, List<FileDTO>>> listFiles(@PathVariable String roomId, @PathVariable String projectName) {
//        List<FileDTO> files = fileService.getFiles(new ProjectDTO(projectName, Long.parseLong(roomId)));
//        if (files.isEmpty())
//            return ResponseEntity.notFound().build();
//        else
//            return ResponseEntity.ok(Map.of("files", files));
//    }
//
//    @PostMapping("/files/create-file")
//    public ResponseEntity<String> createFile(@RequestBody FileDTO fileDTO) {
//        try {
//            fileService.createFile(fileDTO);
//            return ResponseEntity.ok("File created successfully!");
//        }catch (Exception e) {
//            return ResponseEntity.badRequest().body("Failed to create file: " + e.getMessage());
//        }
//    }
//
//    @PostMapping("/files/push-file-content")
//    public ResponseEntity<String> pushFile(@RequestBody FileVersion fileVersion) {
//        try {
//            fileService.pushFileContent(fileVersion);
//            return ResponseEntity.ok("File pushed successfully!");
//        }catch (Exception e) {
//            return ResponseEntity.badRequest().body("Failed to push file content: " + e.getMessage());
//        }
//    }
//
//    @PostMapping("/files/merge-file-content")
//    public ResponseEntity<Map<String, FileDTO>> mergeFileContent(@RequestBody FileDTO newFileDTO) {
//        try {
//
//            FileDTO fileDTO = fileService.mergeFileContent(newFileDTO);
//
//            return ResponseEntity.ok(Map.of("file", fileDTO));
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

}
