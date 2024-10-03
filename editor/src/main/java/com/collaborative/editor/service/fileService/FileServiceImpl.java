package com.collaborative.editor.service.fileService;


import com.collaborative.editor.database.mongodb.FileVersionRepository;
import com.collaborative.editor.database.mysql.ProjectRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.model.mongodb.FileVersion;
import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.mongodb.DuplicateKeyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.FileAlreadyExistsException;
import java.util.List;
import java.util.stream.Collectors;

@Service("FileServiceImpl")
public class FileServiceImpl implements FileService{

    @Autowired
    private FileVersionRepository fileVersionRepository;


    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public List<FileDTO> getFiles(ProjectDTO project) {
        List<FileVersion> fileVersions = fileVersionRepository.findByProjectNameAndRoomId(project.getProjectName(), project.getRoomId()).get();

        return fileVersions.stream().map(
                file -> new FileDTO(
                        file.getFilename(),
                        file.getRoomId(),
                        file.getProjectName()
                        )).collect(Collectors.toList());
    }

    @Override
    public void createFile(FileDTO fileDTO) throws FileAlreadyExistsException {
        try {
            FileVersion fileVersion = new FileVersion();
            fileVersion.setFilename(fileDTO.getFileName());
            fileVersion.setRoomId(fileDTO.getRoomId());
            fileVersion.setProjectName(fileDTO.getProjectName());
            fileVersion.setContent("Typing your first code here ...");
            fileVersionRepository.save(fileVersion);
        } catch (Exception e) {
            throw new FileAlreadyExistsException("File already exists with the name " + fileDTO.getFileName());
        }

    }


    @Override
    public void pushFileContent(FileVersion fileVersion) {
        try {
            fileVersionRepository.upsertFileContent(
                    fileVersion.getFilename(),
                    fileVersion.getProjectName(),
                    fileVersion.getRoomId(),
                    fileVersion.getContent()
            );
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Update failed due to duplicate key violation: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error while updating file content: " + e.getMessage(), e);
        }
    }

    @Override
    public FileVersion mergeFileContent( FileVersion newVersion) {
        try {
            FileVersion oldVersion = fileVersionRepository.findByFileNameProjectNameAndRoomId(
                    newVersion.getProjectName(),
                    newVersion.getFilename(),
                    newVersion.getRoomId()).get();

            return discoverConflict(oldVersion, newVersion.getContent());

        }catch (Exception e){
            throw new RuntimeException("Error while merging file content: " + e.getMessage(), e);
        }

    }

    @Override
    public FileVersion pullFileContent(FileDTO fileDTO) {
        try {

            return fileVersionRepository.findByFileNameProjectNameAndRoomId(
                    fileDTO.getProjectName(),
                    fileDTO.getFileName(),
                    fileDTO.getRoomId()).get();

        }catch (Exception e){
            throw new RuntimeException("Error while pulling file content: " + e.getMessage(), e);
        }
    }

    private static final String CONFLICT_WARNING_MESSAGE = """
        /**
         * ======================================================
         * WARNING: MANUAL CONFLICT RESOLUTION REQUIRED
         * ======================================================
         * The programmer/user must resolve these conflicts manually, 
         * ensuring the code is correct. After resolving the conflicts, 
         * push the resolved version using the PUSH button in the interface.
         *
         * ======================================================
         */
        """;

    public FileVersion discoverConflict(FileVersion oldVersion, String newContent) {
        String oldContent = oldVersion.getContent();
        String[] oldLines = splitLines(oldContent);
        String[] newLines = splitLines(newContent);

        String mergedContent = mergeLinesWithConflictMarkers(oldLines, newLines);
        oldVersion.setContent(mergedContent);

        return oldVersion;
    }

    private String[] splitLines(String content) {
        return content.split("\n");
    }

    private String mergeLinesWithConflictMarkers(String[] oldLines, String[] newLines) {
        StringBuilder mergedContent = new StringBuilder();
        mergedContent.append(CONFLICT_WARNING_MESSAGE).append("\n");

        int oldIndex = 0, newIndex = 0;
        while (oldIndex < oldLines.length && newIndex < newLines.length) {
            String oldLine = oldLines[oldIndex];
            String newLine = newLines[newIndex];

            if (oldLine.equals(newLine)) {
                mergedContent.append(oldLine).append("\n");
                oldIndex++;
                newIndex++;
            } else {
                appendConflict(mergedContent, oldLine, newLine);
                oldIndex++;
                newIndex++;
            }
        }

        appendRemainingLines(mergedContent, oldLines, oldIndex);
        appendRemainingLines(mergedContent, newLines, newIndex);

        return mergedContent.toString();
    }

    private void appendConflict(StringBuilder mergedContent, String oldLine, String newLine) {
        mergedContent.append("<<<<<<< Current Version\n")
                .append(oldLine).append("\n")
                .append("=======\n")
                .append(newLine).append("\n")
                .append(">>>>>>> Incoming Version\n");
    }

    private void appendRemainingLines(StringBuilder mergedContent, String[] lines, int index) {
        while (index < lines.length) {
            mergedContent.append(lines[index]).append("\n");
            index++;
        }
    }

}
