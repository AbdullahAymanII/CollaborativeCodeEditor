package com.collaborative.editor.service.projectService;

import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.database.mongodb.FileRepository;
import com.collaborative.editor.database.mysql.ProjectRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.exception.RoomNotFoundException;
import com.collaborative.editor.model.mysql.project.Project;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mongodb.File;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ProjectServiceImplTest {

    @InjectMocks
    private ProjectServiceImpl projectService;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private FileRepository fileRepository;

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
    void testCreateProject_Success() {
        Room room = new Room();
        when(roomRepository.findByRoomId(projectDTO.getRoomId())).thenReturn(Optional.of(room));

        projectService.createProject(projectDTO);

        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void testCreateProject_RoomNotFound() {
        when(roomRepository.findByRoomId(projectDTO.getRoomId())).thenReturn(Optional.empty());

        assertThrows(RoomNotFoundException.class, () -> projectService.createProject(projectDTO));
    }

    @Test
    void testDeleteProject_Success() {
        Project project = new Project();
        when(projectRepository.findByRoomIdAndProjectName(projectDTO.getRoomId(), projectDTO.getProjectName()))
                .thenReturn(Optional.of(project));

        projectService.deleteProject(projectDTO);

        verify(projectRepository, times(1)).delete(project);
    }

//    @Test
//    void testDownloadProject_Success() throws IOException {
//        Project project = new Project();
//        when(projectRepository.findByRoomIdAndProjectName(projectDTO.getRoomId(), projectDTO.getProjectName()))
//                .thenReturn(Optional.of(project));
//
//        List<File> fileList = List.of(
//                new File(
//                        "TestFile",
//                        "123",
//                        "Test Project",
//                        "file content",
//                        System.currentTimeMillis(),
//                        System.currentTimeMillis(),
//                        ".txt"
//                )
//        );
//
//        when(fileRepository.findByProjectNameAndRoomId(projectDTO.getProjectName(), projectDTO.getRoomId()))
//                .thenReturn(Optional.of(fileList));
//
//        projectService.downloadProject(projectDTO, response);
//
//        verify(response, times(1)).setContentType("application/zip");
//
//        verify(fileRepository, times(1)).findByProjectNameAndRoomId(projectDTO.getProjectName(), projectDTO.getRoomId());
//    }
}
