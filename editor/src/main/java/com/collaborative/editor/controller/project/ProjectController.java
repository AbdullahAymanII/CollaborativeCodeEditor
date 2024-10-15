package com.collaborative.editor.controller.project;


import com.collaborative.editor.database.dto.file.FileDTO;
import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.service.fileService.FileServiceImpl;
import com.collaborative.editor.service.projectService.ProjectServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    private static final String MAIN_VERSION = "Main-version";
    private static final String DEFAULT_EXTENSION = ".txt";

    private final ProjectServiceImpl projectService;
    private final FileServiceImpl fileService;

    @Autowired
    public ProjectController(@Qualifier("ProjectServiceImpl") ProjectServiceImpl projectService, FileServiceImpl fileService) {
        this.projectService = projectService;
        this.fileService = fileService;
    }

    @PostMapping("/create-project")
    public ResponseEntity<String> createProject(@RequestBody ProjectDTO request) {
        try {
            projectService.createProject(request);
            fileService.createFile(new FileDTO(MAIN_VERSION, request.getRoomId(), request.getProjectName(),DEFAULT_EXTENSION));
            return ResponseEntity.ok("Project created successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create project.");
        }
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<Map<String, List<ProjectDTO>>> listProjects(@PathVariable String roomId) {
        try {
            List<ProjectDTO> projects = projectService.getProjects(roomId);
            return ResponseEntity.ok(Map.of("projects", projects));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/remove-project")
    public ResponseEntity<String> deleteProject(@RequestBody ProjectDTO project) {
        try {
            projectService.deleteProject(project);
            return ResponseEntity.ok("Project deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{roomId}/{projectName}/download-project")
    public void downloadProject(@PathVariable String roomId,
                                @PathVariable String projectName,
                                HttpServletResponse response) {

        try {
            projectService.downloadProject(new ProjectDTO(projectName, roomId), response);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

}