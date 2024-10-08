package com.collaborative.editor.service.messageLogsService;

import com.collaborative.editor.model.mongodb.MessageLog;
import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;

import java.util.List;
import java.util.Optional;

public interface LogsService {

    void saveLog(MessageLog log);

    Optional<List<MessageLog>> getLogsByActionType(String type, Long roomId);

    Optional<List<MessageLog>> getLogsByRoomId(Long roomId);

    Optional<List<MessageLog>> getCollaboratorLogs( String sender);

    Optional<List<MessageLog>> getFileLogs(FileDTO file);

    Optional<List<MessageLog>> getProjectLogs(ProjectDTO project);
}

