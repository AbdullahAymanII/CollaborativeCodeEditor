package com.collaborative.editor.service.messageLogsService;

import com.collaborative.editor.database.mongodb.LogsRepository;
import com.collaborative.editor.model.mongodb.MessageLog;
import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LogsServiceImpl implements LogsService {

    @Autowired
    private LogsRepository logsRepository;

    @Override
    public void saveLog(MessageLog log) {
        try {
            logsRepository.save(log);
        } catch (Exception e) {
            throw new RuntimeException("LOG NOT SAVED" + e.getMessage(), e);
        }
    }
    @Override
    public Optional<List<MessageLog>> getLogsByActionType(String type, Long roomId) {
        try {
            return logsRepository.findByType(type, roomId);
        } catch (Exception e) {
            throw new RuntimeException("TYPE NOT FOUND" + e.getMessage(), e);
        }
    }

    @Override
    public Optional<List<MessageLog>> getLogsByRoomId(Long roomId) {
        try {
            return logsRepository.findByRoomId(roomId);
        } catch (Exception e) {
            throw new RuntimeException("ROOM NOT FOUND" + e.getMessage(), e);
        }
    }

    @Override
    public Optional<List<MessageLog>> getCollaboratorLogs(String sender) {
        try {
            return logsRepository.findBySenderEmail(sender);
        } catch (Exception e) {
            throw new RuntimeException("SENDER NOT FOUND" + e.getMessage(), e);
        }
    }

    @Override
    public Optional<List<MessageLog>> getFileLogs(FileDTO file) {
        try {
            return logsRepository.findByFileNameProjectNameAndRoomId(file.getProjectName(), file.getFileName(), file.getRoomId());
        } catch (Exception e) {
            throw new RuntimeException("FILE NOT FOUND" + e.getMessage(), e);
        }
    }

    @Override
    public Optional<List<MessageLog>> getProjectLogs(ProjectDTO project) {
        try {
            return logsRepository.findByProjectNameAndRoomId(project.getProjectName(), project.getRoomId());
        } catch (Exception e) {
            throw new RuntimeException("PROJECT NOT FOUND" + e.getMessage(), e);
        }
    }
}