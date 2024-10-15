package com.collaborative.editor.controller.versionControl;

import com.collaborative.editor.dto.project.ProjectDTO;
import com.collaborative.editor.service.versionControlService.projectService.ProjectService;
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

    private final ProjectService projectService;

    @Autowired
    public ProjectController(@Qualifier("ProjectServiceImpl") ProjectService projectService) {

        this.projectService = projectService;
    }

    @PostMapping("/create-project")
    public ResponseEntity<String> createProject(@RequestBody ProjectDTO request) {
        try {
            projectService.createProject(request);

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