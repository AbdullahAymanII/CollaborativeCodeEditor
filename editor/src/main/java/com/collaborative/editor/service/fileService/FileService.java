package com.collaborative.editor.service.fileService;

import com.collaborative.editor.model.mongodb.FileVersion;
import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;

import java.nio.file.FileAlreadyExistsException;
import java.util.List;

public interface FileService {
    List<FileDTO> getFiles(ProjectDTO project);

    void createFile(FileDTO fileDTO) throws FileAlreadyExistsException;

    void pushFileContent(FileVersion fileVersion);

    FileVersion mergeFileContent( FileVersion newVersion) throws FileAlreadyExistsException;

    FileVersion pullFileContent(FileDTO fileDTO);
}
