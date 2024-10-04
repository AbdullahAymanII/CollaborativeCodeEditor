package com.collaborative.editor.service.projectService;


import com.collaborative.editor.database.mysql.ProjectRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.model.mysql.project.Project;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.collaborative.editor.model.mysql.room.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("ProjectServiceImpl")
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RoomRepository roomRepository;


    @Override
    public void createProject(ProjectDTO project, String projectDescription) throws NoSuchFieldException {
        Optional<Room> room = roomRepository.findByRoomId(project.getRoomId());

        if(room.isPresent()){

            Project newProject = new Project();
            newProject.setName(project.getProjectName());
            newProject.setRoom(room.get());
            newProject.setCreatedAt(LocalDateTime.now());
            newProject.setDescription(projectDescription);
            projectRepository.save(newProject);
        } else
            throw new NoSuchFieldException("There is no room for project " + project.getRoomId() );
    }

    @Override
    public List<ProjectDTO> getProjects(Long roomId){
        Optional<Room> room = roomRepository.findByRoomId(roomId);

        return room.map(value -> value.getProjects().stream().map(
                        project -> new ProjectDTO(project.getName(), roomId)
                )
                .collect(Collectors.toList())).orElseGet(List::of);
    }
}
