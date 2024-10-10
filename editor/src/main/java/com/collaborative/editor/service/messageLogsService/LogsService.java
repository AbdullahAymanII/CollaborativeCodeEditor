package com.collaborative.editor.service.messageLogsService;

import com.collaborative.editor.database.dto.file.FileDTO;
import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.model.mongodb.File;
import com.collaborative.editor.model.mongodb.MessageLog;


import java.util.List;
import java.util.Optional;

public interface LogsService {

    void saveLog(MessageLog log);

    Optional<List<MessageLog>> getLogsByActionType(String type, String roomId);

    Optional<List<MessageLog>> getLogsByRoomId(String roomId);

    Optional<List<MessageLog>> getCollaboratorLogs( String sender);

    Optional<List<MessageLog>> getFileLogs(String projectName, String roomId, String filename);

    Optional<List<MessageLog>> getProjectLogs(ProjectDTO project);
}

