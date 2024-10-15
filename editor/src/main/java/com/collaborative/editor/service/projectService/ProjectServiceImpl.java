//package com.collaborative.editor.service.projectService;
//
//
//import com.collaborative.editor.database.mysql.ProjectRepository;
//import com.collaborative.editor.database.mysql.RoomRepository;
//import com.collaborative.editor.model.mysql.project.Project;
//import com.collaborative.editor.dto.project.ProjectDTO;
//import com.collaborative.editor.model.mysql.room.Room;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service("ProjectServiceImpl")
//public class ProjectServiceImpl implements ProjectService {
//
//    @Autowired
//    private ProjectRepository projectRepository;
//
//    @Autowired
//    private RoomRepository roomRepository;
//
//
//    @Override
//    public void createProject(ProjectDTO project) throws NoSuchFieldException {
//        Optional<Room> room = roomRepository.findByRoomId(project.getRoomId());
//
//        if(room.isPresent()){
//            Project newProject = new Project();
//
//            newProject.setName(project.getProjectName());
//            newProject.setRoom(room.get());
//            newProject.setCreatedAt(LocalDateTime.now());
//
//            projectRepository.save(newProject);
//        } else
//            throw new NoSuchFieldException("There is no room for project " + project.getRoomId() );
//    }
//
//    @Override
//    public List<ProjectDTO> getProjects(Long roomId){
//        Optional<Room> room = roomRepository.findByRoomId(roomId);
//
//        return room.map(value -> value.getProjects().stream().map(
//                        project -> new ProjectDTO(project.getName(), roomId)
//                )
//                .collect(Collectors.toList())).orElseGet(List::of);
//    }
//
//    @Override
//    public void deleteProject(ProjectDTO projectDTO) throws NoSuchMethodException {
//        try {
//            Project project = projectRepository.findByRoomIdAndProjectName(projectDTO.getRoomId(),projectDTO.getProjectName()).get();
//            projectRepository.delete(project);
//        }catch (Exception e) {
//            throw new NoSuchMethodException("no such method for project");
//        }
//
//    }
//}


package com.collaborative.editor.service.projectService;

import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.database.mongodb.FileRepository;
import com.collaborative.editor.database.mysql.ProjectRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.exception.ResourceNotFoundException;
import com.collaborative.editor.model.mongodb.File;
import com.collaborative.editor.model.mysql.project.Project;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.exception.RoomNotFoundException;
import com.collaborative.editor.exception.ProjectNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service("ProjectServiceImpl")
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final RoomRepository roomRepository;
    private final FileRepository fileRepository;
    private Lock lock = new ReentrantLock();
    @Autowired
    public ProjectServiceImpl(ProjectRepository projectRepository, RoomRepository roomRepository, FileRepository fileRepository) {
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
        projectRepository.save(newProject);
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
    public void deleteProject(ProjectDTO projectDTO) {
        try {
            lock.lock();
            Project project = projectRepository.findByRoomIdAndProjectName(projectDTO.getRoomId(), projectDTO.getProjectName())
                    .orElseThrow(() -> new ProjectNotFoundException("Project not found for room ID " + projectDTO.getRoomId()));
            projectRepository.delete(project);
        }finally {
            lock.unlock();
        }
    }



    @Override
    public void downloadProject(ProjectDTO projectDTO, HttpServletResponse response) throws IOException {
        Project project = findProjectByRoomAndName(projectDTO.getRoomId(), projectDTO.getProjectName());
        List<File> files = findFilesByProjectAndRoom(projectDTO.getProjectName(), projectDTO.getRoomId());

        setupResponseHeaders(response, projectDTO.getProjectName());

        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
            writeFilesToZip(files, zipOut);
        }
    }

    private Project findProjectByRoomAndName(String roomId, String projectName) {
        return projectRepository.findByRoomIdAndProjectName(roomId, projectName)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private List<File> findFilesByProjectAndRoom(String projectName, String roomId) {
        return fileRepository.findByProjectNameAndRoomId(projectName, roomId)
                .filter(files -> !files.isEmpty())
                .orElseThrow(() -> new ResourceNotFoundException("No files found for the project"));
    }

    private void setupResponseHeaders(HttpServletResponse response, String projectName) {
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=" + projectName + ".zip");
    }

    private void writeFilesToZip(List<File> files, ZipOutputStream zipOut) throws IOException {
        for (File file : files) {
            ZipEntry zipEntry = new ZipEntry(file.getFilename() + "." + file.getExtension());
            zipOut.putNextEntry(zipEntry);
            zipOut.write(file.getContent().getBytes(StandardCharsets.UTF_8));
            zipOut.closeEntry();
        }
    }



//    @Override
//    public void downloadProject(ProjectDTO projectDTO, HttpServletResponse response) throws IOException {
//        Optional<Project> projectOpt = projectRepository.findByRoomIdAndProjectName(projectDTO.getRoomId(), projectDTO.getProjectName());
//        if (projectOpt.isEmpty()) {
//            throw new IllegalArgumentException("Project not found");
//        }
//
//        Optional<List<File>> filesOpt = fileRepository.findByProjectNameAndRoomId(projectDTO.getProjectName(), projectDTO.getRoomId());
//        if (filesOpt.isEmpty() || filesOpt.get().isEmpty()) {
//            throw new IllegalArgumentException("No files found for the project");
//        }
//
//        List<File> files = filesOpt.get();
//
//        response.setContentType("application/zip");
//        response.setHeader("Content-Disposition", "attachment; filename=" + projectDTO.getProjectName() + ".zip");
//
//        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
//            for (File file : files) {
//
//                ZipEntry zipEntry = new ZipEntry(file.getFilename() + "." + file.getExtension());
//                zipOut.putNextEntry(zipEntry);
//
//                byte[] fileContent = file.getContent().getBytes(StandardCharsets.UTF_8);
//                zipOut.write(fileContent);
//                zipOut.closeEntry();
//            }
//        }
//    }

    private Project buildNewProject(ProjectDTO project, Room room) {
        Project newProject = new Project();
//        buildNewProject(project, room);
        newProject.setName(project.getProjectName());
        newProject.setRoom(room);
        newProject.setCreatedAt(LocalDateTime.now());
        return newProject;
    }
}
