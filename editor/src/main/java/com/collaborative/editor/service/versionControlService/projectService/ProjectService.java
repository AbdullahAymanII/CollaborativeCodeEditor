package com.collaborative.editor.service.versionControlService.projectService;


import com.collaborative.editor.dto.project.ProjectDTO;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface ProjectService {

    void createProject(ProjectDTO project) throws NoSuchFieldException;

    List<ProjectDTO> getProjects(String roomId);

    void deleteProject(ProjectDTO projectDTO) throws NoSuchMethodException;

    void downloadProject(ProjectDTO projectDTO, HttpServletResponse response) throws IOException;
}
