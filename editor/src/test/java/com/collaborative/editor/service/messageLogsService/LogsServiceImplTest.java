package com.collaborative.editor.service.messageLogsService;

import com.collaborative.editor.dto.project.ProjectDTO;
import com.collaborative.editor.repository.mongodb.LogsRepository;
import com.collaborative.editor.model.messageLog.MessageLog;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class LogsServiceImplTest {

    @InjectMocks
    private LogsServiceImpl logsService;

    @Mock
    private LogsRepository logsRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveLog() {
        MessageLog log = new MessageLog("user1", "developer", "file1", "room1", "project1", "log content", 123L, "action");

        when(logsRepository.save(log)).thenReturn(log);

        assertDoesNotThrow(() -> logsService.saveLog(log));
    }

    @Test
    void testGetLogsByActionType() {
        String type = "action";
        String roomId = "room1";
        List<MessageLog> mockLogs = List.of(new MessageLog("user1", "developer", "file1", roomId, "project1", "log content", 123L, type));

        when(logsRepository.findByType(type, roomId)).thenReturn(Optional.of(mockLogs));

        Optional<List<MessageLog>> result = logsService.getLogsByActionType(type, roomId);

        assertTrue(result.isPresent());
        assertEquals(mockLogs, result.get());
    }

    @Test
    void testGetLogsByRoomId() {
        String roomId = "room1";
        List<MessageLog> mockLogs = List.of(new MessageLog("user1", "developer", "file1", roomId, "project1", "log content", 123L, "action"));

        when(logsRepository.findByRoomId(roomId)).thenReturn(Optional.of(mockLogs));

        Optional<List<MessageLog>> result = logsService.getLogsByRoomId(roomId);

        assertTrue(result.isPresent());
        assertEquals(mockLogs, result.get());
    }

    @Test
    void testGetCollaboratorLogs() {
        String sender = "user1";
        List<MessageLog> mockLogs = List.of(new MessageLog(sender, "developer", "file1", "room1", "project1", "log content", 123L, "action"));

        when(logsRepository.findBySenderEmail(sender)).thenReturn(Optional.of(mockLogs));

        Optional<List<MessageLog>> result = logsService.getCollaboratorLogs(sender);

        assertTrue(result.isPresent());
        assertEquals(mockLogs, result.get());
    }

    @Test
    void testGetFileLogs() {
        String projectName = "project1";
        String roomId = "room1";
        String filename = "file1";
        List<MessageLog> mockLogs = List.of(new MessageLog("user1", "developer", filename, roomId, projectName, "log content", 123L, "action"));

        when(logsRepository.findByFileNameProjectNameAndRoomId(projectName, filename, roomId)).thenReturn(Optional.of(mockLogs));

        Optional<List<MessageLog>> result = logsService.getFileLogs(projectName, roomId, filename);

        assertTrue(result.isPresent());
        assertEquals(mockLogs, result.get());
    }

    @Test
    void testGetProjectLogs() {
        String roomId = "room1";
        String projectName = "project1";
        ProjectDTO project = new ProjectDTO(projectName, roomId);
        List<MessageLog> mockLogs = List.of(new MessageLog("user1", "developer", "file1", roomId, projectName, "log content", 123L, "action"));

        when(logsRepository.findByProjectNameAndRoomId(projectName, roomId)).thenReturn(Optional.of(mockLogs));

        Optional<List<MessageLog>> result = logsService.getProjectLogs(project);

        assertTrue(result.isPresent());
        assertEquals(mockLogs, result.get());
    }
}
