package com.collaborative.editor.service.versionControlService.fileService;

import com.collaborative.editor.dto.file.FileDTO;
import com.collaborative.editor.dto.project.ProjectDTO;
import com.collaborative.editor.exception.versionControlException.fileException.FileAlreadyExistsException;
import com.collaborative.editor.model.codeUpdate.CodeUpdate;
import com.collaborative.editor.repository.mongodb.CodeUpdateRepository;
import com.collaborative.editor.repository.mongodb.FileRepository;
import com.collaborative.editor.model.file.File;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service("FileServiceImpl")
public class FileServiceImpl implements FileService {

    private static final String DEFAULT_CONTENT_FILE = "Typing your first code here...";
    private final FileRepository fileVersionRepository;
    private final FileMergeHandler fileMergeHandler;
    private final CodeUpdateRepository codeUpdateRepository;

    private final Map<String, Object> fileLocks = new ConcurrentHashMap<>();



    @Autowired
    public FileServiceImpl(FileRepository fileVersionRepository,
                           FileMergeHandler fileMergeHandler,
                           CodeUpdateRepository codeUpdateRepository) {
        this.fileVersionRepository = fileVersionRepository;
        this.fileMergeHandler = fileMergeHandler;
        this.codeUpdateRepository = codeUpdateRepository;
    }

    @Override
    public List<FileDTO> getFiles(ProjectDTO project) {
        List<File> files = fileVersionRepository.findByProjectNameAndRoomId(project.getProjectName(), project.getRoomId())
                .orElseThrow(() -> new RuntimeException("No files found for project " + project.getProjectName()));

        return files.stream()
                .map(file ->
                        FileDTO
                                .builder()
                                .filename(file.getFilename())
                                .roomId(file.getRoomId())
                                .projectName(file.getProjectName())
                                .extension(file.getExtension())
                                .build()
                )
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void createFile(FileDTO fileDTO) throws FileAlreadyExistsException {

        try {

            File file = File
                    .builder()
                    .filename(fileDTO.getFilename())
                    .roomId(fileDTO.getRoomId())
                    .projectName(fileDTO.getProjectName())
                    .extension(fileDTO.getExtension())
                    .createdAt(System.currentTimeMillis())
                    .content(DEFAULT_CONTENT_FILE)
                    .lastModifiedAt(System.currentTimeMillis())
                    .build();

            if (checkExistingFile(file).isEmpty()) {
                fileVersionRepository.save(file);
            } else {
                throw new FileAlreadyExistsException("File already exists with the name " + fileDTO.getFilename());
            }

        } catch (OptimisticLockException e) {
            throw new RuntimeException("Failed to push content due to concurrent modification.", e);
        }


    }


    @Override
    @Transactional
    public void pushFileContent(File file) {
        String fileKey = file.getRoomId() + "-" + file.getProjectName() + "-" + file.getFilename();

        synchronized (getFileLock(fileKey)) {
            try {
                Optional<File> existingFile = checkExistingFile(file);

                if (existingFile.isPresent()) {
                    file.setLastModifiedAt(System.currentTimeMillis());
                    fileVersionRepository.upsertFileContent(
                            file.getFilename(),
                            file.getProjectName(),
                            file.getRoomId(),
                            file.getContent(),
                            file.getCreatedAt(),
                            file.getLastModifiedAt(),
                            file.getExtension()
                    );
                } else {
                    throw new RuntimeException("File not found for pushing content.");
                }
            } catch (OptimisticLockException e) {
                throw new RuntimeException("Failed to push content due to concurrent modification.", e);
            }
        }
    }


    @Override
    public File mergeFileContent(File newVersion) {
        String fileKey = newVersion.getRoomId() + "-" + newVersion.getProjectName() + "-" + newVersion.getFilename();

        synchronized (getFileLock(fileKey)) {
            File oldVersion = fileVersionRepository.findByFileNameProjectNameAndRoomId(
                    newVersion.getProjectName(),
                    newVersion.getFilename(),
                    newVersion.getRoomId()).orElseThrow(() -> new RuntimeException("Old version not found"));

            return fileMergeHandler.mergeFileContent(oldVersion, newVersion.getContent());
        }
    }


    @Override
    public File pullFileContent(FileDTO fileDTO) {

        Optional<CodeUpdate> codeUpdate = checkExistingCodeUpdate(fileDTO);

        if(codeUpdate.isEmpty()){
            return fileVersionRepository.findByFileNameProjectNameAndRoomId(
                    fileDTO.getProjectName(),
                    fileDTO.getFilename(),
                    fileDTO.getRoomId()).orElseThrow(() -> new RuntimeException("File not found"));
        } else {
            File file =  fileVersionRepository.findByFileNameProjectNameAndRoomId(
                    fileDTO.getProjectName(),
                    fileDTO.getFilename(),
                    fileDTO.getRoomId()).get();
            file.setContent(codeUpdate.get().getCode());
            return file;
        }

    }

    private Optional<File> checkExistingFile(File file) {
        return fileVersionRepository.findByFileNameProjectNameAndRoomId(
                file.getProjectName(),
                file.getFilename(),
                file.getRoomId()
        );
    }
    private Optional<CodeUpdate> checkExistingCodeUpdate(FileDTO file) {
        return codeUpdateRepository.findByFileNameProjectNameAndRoomId(
                file.getProjectName(),
                file.getFilename(),
                file.getRoomId()
        );
    }

    private Object getFileLock(String roomId) {
        return fileLocks.computeIfAbsent(roomId, k -> new Object());
    }

}
