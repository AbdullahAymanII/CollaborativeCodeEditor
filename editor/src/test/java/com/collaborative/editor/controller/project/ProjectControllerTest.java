package com.collaborative.editor.controller.project;

import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.service.fileService.FileServiceImpl;
import com.collaborative.editor.service.projectService.ProjectServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;


import java.nio.file.FileAlreadyExistsException;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectControllerTest {

    @InjectMocks
    private ProjectController projectController;

    @Mock
    private ProjectServiceImpl projectService;

    @Mock
    private FileServiceImpl fileService;

    @Mock
    private HttpServletResponse response;

    private ProjectDTO projectDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        projectDTO = new ProjectDTO();
        projectDTO.setProjectName("Test Project");
        projectDTO.setRoomId("123");
    }

    @Test
    void testCreateProject_Success() throws FileAlreadyExistsException {
        doNothing().when(projectService).createProject(projectDTO);
        doNothing().when(fileService).createFile(any());

        ResponseEntity<String> response = projectController.createProject(projectDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Project created successfully!", response.getBody());
    }

    @Test
    void testCreateProject_Failure() {
        doThrow(new RuntimeException()).when(projectService).createProject(projectDTO);

        ResponseEntity<String> response = projectController.createProject(projectDTO);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Failed to create project.", response.getBody());
    }

    @Test
    void testListProjects_Success() {
        List<ProjectDTO> projectList = List.of(new ProjectDTO("Test Project", "123"));
        when(projectService.getProjects("123")).thenReturn(projectList);

        ResponseEntity<Map<String, List<ProjectDTO>>> response = projectController.listProjects("123");

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().get("projects").size());
    }

    @Test
    void testListProjects_NotFound() {
        when(projectService.getProjects("123")).thenThrow(new RuntimeException());

        ResponseEntity<Map<String, List<ProjectDTO>>> response = projectController.listProjects("123");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void testDeleteProject_Success() {
        doNothing().when(projectService).deleteProject(projectDTO);

        ResponseEntity<String> response = projectController.deleteProject(projectDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Project deleted successfully!", response.getBody());
    }

}
