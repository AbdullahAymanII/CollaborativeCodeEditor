package com.collaborative.editor.service.LogsService;

import com.collaborative.editor.dto.project.ProjectDTO;
import com.collaborative.editor.model.messageLog.MessageLog;


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

