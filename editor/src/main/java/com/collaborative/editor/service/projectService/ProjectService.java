package com.collaborative.editor.service.projectService;


import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.model.mysql.project.Project;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface ProjectService {

    void createProject(ProjectDTO project) throws NoSuchFieldException;

    List<ProjectDTO> getProjects(String roomId);

    void deleteProject(ProjectDTO projectDTO) throws NoSuchMethodException;

    void downloadProject(ProjectDTO projectDTO, HttpServletResponse response) throws IOException;
}
