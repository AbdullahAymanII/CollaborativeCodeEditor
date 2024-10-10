package com.collaborative.editor.service.fileService;

import com.collaborative.editor.database.dto.file.FileDTO;
import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.model.mongodb.File;


import java.nio.file.FileAlreadyExistsException;
import java.util.List;

public interface FileService {
    List<FileDTO> getFiles(ProjectDTO project);

    void createFile(FileDTO fileDTO) throws FileAlreadyExistsException;

    void pushFileContent(File file);

    File mergeFileContent(File newVersion) throws FileAlreadyExistsException;

    File pullFileContent(FileDTO fileDTO);
}
