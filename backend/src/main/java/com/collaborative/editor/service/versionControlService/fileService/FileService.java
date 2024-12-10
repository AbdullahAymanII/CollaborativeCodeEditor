package com.collaborative.editor.service.versionControlService.fileService;

import com.collaborative.editor.dto.file.FileDTO;
import com.collaborative.editor.dto.project.ProjectDTO;
import com.collaborative.editor.exception.versionControlException.fileException.FileAlreadyExistsException;
import com.collaborative.editor.model.file.File;


import java.util.List;

public interface FileService {
    List<FileDTO> getFiles(ProjectDTO project);

    void createFile(FileDTO fileDTO) throws FileAlreadyExistsException;

    void pushFileContent(File file);

    File mergeFileContent(File newVersion) throws FileAlreadyExistsException;

    File pullFileContent(FileDTO fileDTO);
}
