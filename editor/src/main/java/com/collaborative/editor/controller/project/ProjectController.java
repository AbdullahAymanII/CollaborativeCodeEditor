package com.collaborative.editor.controller.project;

import com.collaborative.editor.model.mongodb.FileVersion;
import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.collaborative.editor.service.fileService.FileServiceImpl;
import com.collaborative.editor.service.projectService.ProjectServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.FileAlreadyExistsException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectServiceImpl projectService;

    @Autowired
    private FileServiceImpl fileService;

    public ProjectController(@Qualifier("ProjectServiceImpl") ProjectServiceImpl projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/create-project")
    public ResponseEntity<String> createProject(@RequestBody Map<String, String> request) {
        String projectName = request.get("projectName");
        String projectDescription = request.get("projectDescription");
        String roomId = request.get("roomId");
        try {
            projectService.createProject(new ProjectDTO(projectName, Long.parseLong(roomId)), projectDescription);
            fileService.createFile(new FileDTO("Main-version", Long.parseLong(roomId), projectName));
            return ResponseEntity.ok("Project created successfully!");
        } catch (Exception e) {
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

    @PostMapping("/remove-project")
    public ResponseEntity<String> deleteProject(@RequestBody ProjectDTO project) {
        try {
            projectService.deleteProject(project);
            return ResponseEntity.ok("Project deleted successfully!");
        }catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

}
