package com.collaborative.editor.service.projectService;

import com.collaborative.editor.model.mysql.project.ProjectDTO;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface ProjectService {
    void createProject(ProjectDTO project, String projectDescription) throws NoSuchFieldException;
    List<ProjectDTO> getProjects(Long roomId);

    void deleteProject(ProjectDTO projectDTO) throws NoSuchMethodException;
}
