package com.collaborative.editor.service.projectService;


import com.collaborative.editor.database.dto.project.ProjectDTO;

import java.util.List;

public interface ProjectService {

    void createProject(ProjectDTO project) throws NoSuchFieldException;

    List<ProjectDTO> getProjects(String roomId);

    void deleteProject(ProjectDTO projectDTO) throws NoSuchMethodException;
}
