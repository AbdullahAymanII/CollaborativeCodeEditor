//package com.collaborative.editor.service.fileService;
//
//
//import com.collaborative.editor.database.dto.file.FileDTO;
//import com.collaborative.editor.database.dto.project.ProjectDTO;
//import com.collaborative.editor.database.mongodb.FileRepository;
//import com.collaborative.editor.database.mysql.ProjectRepository;
//import com.collaborative.editor.database.mysql.RoomRepository;
//import com.collaborative.editor.model.mongodb.File;
//import com.mongodb.DuplicateKeyException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.nio.file.FileAlreadyExistsException;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service("FileServiceImpl")
//public class FileServiceImpl implements FileService{
//
//    @Autowired
//    private FileRepository fileVersionRepository;
//
//
//    @Autowired
//    private ProjectRepository projectRepository;
//
//    @Autowired
//    private RoomRepository roomRepository;
//
//    @Override
//    public List<FileDTO> getFiles(ProjectDTO project) {
//        List<File> files = fileVersionRepository.findByProjectNameAndRoomId(project.getProjectName(), project.getRoomId()).get();
//
//        return files.stream().map(
//                file -> new FileDTO(
//                        file.getFilename(),
//                        file.getRoomId(),
//                        file.getProjectName()
//                        )).collect(Collectors.toList());
//    }
//
//    @Override
//    public void createFile(FileDTO fileDTO) throws FileAlreadyExistsException {
//        try {
//            File file = new File();
//            file.setFilename(fileDTO.getFilename());
//            file.setRoomId(fileDTO.getRoomId());
//            file.setProjectName(fileDTO.getProjectName());
//            file.setContent("Typing your first code here ...");
//            fileVersionRepository.save(file);
//        } catch (Exception e) {
//            throw new FileAlreadyExistsException("File already exists with the name " + fileDTO.getFilename());
//        }
//
//    }
//
//
//    @Override
//    public void pushFileContent(File file) {
//        try {
//            fileVersionRepository.upsertFileContent(
//                    file.getFilename(),
//                    file.getProjectName(),
//                    file.getRoomId(),
//                    file.getContent()
//            );
//        } catch (DuplicateKeyException e) {
//            throw new RuntimeException("Update failed due to duplicate key violation: " + e.getMessage(), e);
//        } catch (Exception e) {
//            throw new RuntimeException("Error while updating file content: " + e.getMessage(), e);
//        }
//    }
//
//    @Override
//    public File mergeFileContent(File newVersion) {
//        try {
//            File oldVersion = fileVersionRepository.findByFileNameProjectNameAndRoomId(
//                    newVersion.getProjectName(),
//                    newVersion.getFilename(),
//                    newVersion.getRoomId()).get();
//
//            return discoverConflict(oldVersion, newVersion.getContent());
//
//        }catch (Exception e){
//            throw new RuntimeException("Error while merging file content: " + e.getMessage(), e);
//        }
//
//    }
//
//    @Override
//    public File pullFileContent(FileDTO fileDTO) {
//        try {
//
//            return fileVersionRepository.findByFileNameProjectNameAndRoomId(
//                    fileDTO.getProjectName(),
//                    fileDTO.getFilename(),
//                    fileDTO.getRoomId()).get();
//
//        }catch (Exception e){
//            throw new RuntimeException("Error while pulling file content: " + e.getMessage(), e);
//        }
//    }
//
//    private static final String CONFLICT_WARNING_MESSAGE = """
//        /**
//         * ======================================================
//         * WARNING: MANUAL CONFLICT RESOLUTION REQUIRED
//         * ======================================================
//         * The programmer/user must resolve these conflicts manually,
//         * ensuring the code is correct. After resolving the conflicts,
//         * push the resolved version using the PUSH button in the interface.
//         *
//         * ======================================================
//         */
//        """;
//
//    public File discoverConflict(File oldVersion, String newContent) {
//        String oldContent = oldVersion.getContent();
//        String[] oldLines = splitLines(oldContent);
//        String[] newLines = splitLines(newContent);
//
//        String mergedContent = mergeLinesWithConflictMarkers(oldLines, newLines);
//        oldVersion.setContent(mergedContent);
//
//        return oldVersion;
//    }
//
//    private String[] splitLines(String content) {
//        return content.split("\n");
//    }
//
//    private String mergeLinesWithConflictMarkers(String[] oldLines, String[] newLines) {
//        StringBuilder mergedContent = new StringBuilder();
//        mergedContent.append(CONFLICT_WARNING_MESSAGE).append("\n");
//
//        int oldIndex = 0, newIndex = 0;
//        while (oldIndex < oldLines.length && newIndex < newLines.length) {
//            String oldLine = oldLines[oldIndex];
//            String newLine = newLines[newIndex];
//
//            if (oldLine.equals(newLine)) {
//                mergedContent.append(oldLine).append("\n");
//                oldIndex++;
//                newIndex++;
//            } else {
//                appendConflict(mergedContent, oldLine, newLine);
//                oldIndex++;
//                newIndex++;
//            }
//        }
//
//        appendRemainingLines(mergedContent, oldLines, oldIndex);
//        appendRemainingLines(mergedContent, newLines, newIndex);
//
//        return mergedContent.toString();
//    }
//
//    private void appendConflict(StringBuilder mergedContent, String oldLine, String newLine) {
//        mergedContent.append("<<<<<<< Current Version\n")
//                .append(oldLine).append("\n")
//                .append("=======\n")
//                .append(newLine).append("\n")
//                .append(">>>>>>> Incoming Version\n");
//    }
//
//    private void appendRemainingLines(StringBuilder mergedContent, String[] lines, int index) {
//        while (index < lines.length) {
//            mergedContent.append(lines[index]).append("\n");
//            index++;
//        }
//    }
//
//}


package com.collaborative.editor.service.fileService;

import com.collaborative.editor.database.dto.file.FileDTO;
import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.database.mongodb.FileRepository;
import com.collaborative.editor.model.mongodb.File;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.FileAlreadyExistsException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("FileServiceImpl")
public class FileServiceImpl implements FileService {

    private final FileRepository fileVersionRepository;
    private final FileMergeHandler fileMergeHandler;

    @Autowired
    public FileServiceImpl(FileRepository fileVersionRepository, FileMergeHandler fileMergeHandler) {
        this.fileVersionRepository = fileVersionRepository;
        this.fileMergeHandler = fileMergeHandler;
    }

    @Override
    public List<FileDTO> getFiles(ProjectDTO project) {
        List<File> files = fileVersionRepository.findByProjectNameAndRoomId(project.getProjectName(), project.getRoomId())
                .orElseThrow(() -> new RuntimeException("No files found for project " + project.getProjectName()));

        return files.stream()
                .map(file -> new FileDTO(file.getFilename(), file.getRoomId(), file.getProjectName(), file.getExtension()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void createFile(FileDTO fileDTO) throws FileAlreadyExistsException {

        try {
            File file = new File();
            file.setFilename(fileDTO.getFilename());
            file.setRoomId(fileDTO.getRoomId());
            file.setProjectName(fileDTO.getProjectName());
            file.setCreatedAt(System.currentTimeMillis());
            file.setExtension(fileDTO.getExtension());
            file.setContent("Typing your first code here...");

            if(checkExistingFile(file).isEmpty()){
                fileVersionRepository.save(file);
            }else {
                throw new FileAlreadyExistsException("File already exists with the name " + fileDTO.getFilename());
            }
        }catch (OptimisticLockException e) {
            throw new RuntimeException("Failed to push content due to concurrent modification.", e);
        }


    }

    @Override
    @Transactional
    public synchronized void pushFileContent(File file) {
        try {
            Optional<File> existingFile = checkExistingFile(file);

            if (existingFile.isPresent()) {
                File dbFile = existingFile.get();
                dbFile.setContent(file.getContent());
                dbFile.setLastModifiedAt(System.currentTimeMillis());

                fileVersionRepository.upsertFileContent(
                        dbFile.getFilename(),
                        dbFile.getProjectName(),
                        dbFile.getRoomId(),
                        dbFile.getContent()
                );
            } else {
                throw new RuntimeException("File not found for pushing content.");
            }
        } catch (OptimisticLockException e) {
            throw new RuntimeException("Failed to push content due to concurrent modification.", e);
        }
    }

    @Override
    public File mergeFileContent(File newVersion) {
        File oldVersion = fileVersionRepository.findByFileNameProjectNameAndRoomId(
                newVersion.getProjectName(),
                newVersion.getFilename(),
                newVersion.getRoomId()).orElseThrow(() -> new RuntimeException("Old version not found"));

        return fileMergeHandler.mergeFileContent(oldVersion, newVersion.getContent());
    }

    @Override
    public File pullFileContent(FileDTO fileDTO) {
        return fileVersionRepository.findByFileNameProjectNameAndRoomId(
                fileDTO.getProjectName(),
                fileDTO.getFilename(),
                fileDTO.getRoomId()).orElseThrow(() -> new RuntimeException("File not found"));
    }

    private Optional<File> checkExistingFile(File file) {
        return fileVersionRepository.findByFileNameProjectNameAndRoomId(
                file.getProjectName(),
                file.getFilename(),
                file.getRoomId()
        );
    }
}
