package com.collaborative.editor.service.versionControlService.projectService;

import com.collaborative.editor.dto.file.FileDTO;
import com.collaborative.editor.dto.project.ProjectDTO;
import com.collaborative.editor.repository.mongodb.FileRepository;
import com.collaborative.editor.repository.mysql.ProjectRepository;
import com.collaborative.editor.repository.mysql.RoomRepository;
import com.collaborative.editor.model.file.File;
import com.collaborative.editor.model.project.Project;
import com.collaborative.editor.model.room.Room;
import com.collaborative.editor.exception.roomException.RoomNotFoundException;
import com.collaborative.editor.exception.versionControlException.projectException.ProjectNotFoundException;
import com.collaborative.editor.service.versionControlService.fileService.FileService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service("ProjectServiceImpl")
public class ProjectServiceImpl implements ProjectService {

    private static final String MAIN_VERSION = "Main-version";
    private static final String DEFAULT_EXTENSION = ".txt";

    private final Map<String, Object> projectLocks = new ConcurrentHashMap<>();


    @Autowired
    private FileService fileService;

    @Autowired
    private ProjectDownloadService projectDownloadService;

    private final ProjectRepository projectRepository;
    private final RoomRepository roomRepository;
    private final FileRepository fileRepository;

    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository,
                              RoomRepository roomRepository,
                              FileRepository fileRepository
    ) {
        this.projectRepository = projectRepository;
        this.roomRepository = roomRepository;
        this.fileRepository = fileRepository;
    }

    @Override
    @Transactional
    public void createProject(ProjectDTO project) {
        Room room = roomRepository.findByRoomId(project.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException("Room not found for ID " + project.getRoomId()));

        Project newProject = buildNewProject(project, room);
        try {
            projectRepository.save(newProject);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create project: " + e.getMessage());
        }

        createDefaultFile(project);
    }

    private Project buildNewProject(ProjectDTO project, Room room) {

        return Project.builder()
                .name(project.getProjectName())
                .room(room)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .description("")
                .build();
    }

    private void createDefaultFile(ProjectDTO project) {
        try {
            fileService.createFile(
                    FileDTO
                            .builder()
                            .filename(MAIN_VERSION)
                            .projectName(project.getProjectName())
                            .roomId(project.getRoomId())
                            .extension(DEFAULT_EXTENSION)
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to create default file: " + e.getMessage());
        }
    }

    @Override
    public void deleteProject(ProjectDTO projectDTO) {
        String fileKey = projectDTO.getRoomId() + "-" + projectDTO.getProjectName();

        synchronized (getProjectLock(fileKey)) {
            try {
                Project project = projectRepository.findByRoomIdAndProjectName(
                        projectDTO.getRoomId(),
                        projectDTO.getProjectName()
                ).orElseThrow(() -> new ProjectNotFoundException(
                        "Project not found for room ID " + projectDTO.getRoomId()
                ));

                projectRepository.delete(project);
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete project.", e);
            }
        }
    }

    @Override
    public List<ProjectDTO> getProjects(String roomId) {
        Room room = roomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found for ID " + roomId));

        return room.getProjects().stream()
                .map(project -> new ProjectDTO(project.getName(), roomId))
                .collect(Collectors.toList());
    }


    @Override
    public void downloadProject(ProjectDTO projectDTO, HttpServletResponse response) throws IOException {
        Project project = findProjectByRoomAndName(
                projectDTO.getRoomId(),
                projectDTO.getProjectName()
        );

        List<File> files = findFilesByProjectAndRoom(
                projectDTO.getProjectName(),
                projectDTO.getRoomId()
        );

        projectDownloadService.downloadProjectFiles(
                projectDTO.getProjectName(),
                files,
                response
        );
    }

    private Project findProjectByRoomAndName(String roomId, String projectName) {
        return projectRepository.findByRoomIdAndProjectName(roomId, projectName)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));
    }

    private List<File> findFilesByProjectAndRoom(String projectName, String roomId) {
        return fileRepository.findByProjectNameAndRoomId(projectName, roomId)
                .filter(files -> !files.isEmpty())
                .orElseThrow(() -> new ProjectNotFoundException("No files found for the project"));
    }

    private Object getProjectLock(String roomId) {
        return projectLocks.computeIfAbsent(roomId, k -> new Object());
    }
}
