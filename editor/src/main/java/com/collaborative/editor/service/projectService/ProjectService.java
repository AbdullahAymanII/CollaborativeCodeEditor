package com.collaborative.editor.service.projectService;

import com.collaborative.editor.model.mysql.project.ProjectDTO;

import java.util.List;

public interface ProjectService {
    boolean createProject(ProjectDTO project, String projectDescription);
    List<ProjectDTO> getProjects(Long roomId);
}
