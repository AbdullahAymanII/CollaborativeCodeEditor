package com.collaborative.editor.controller.versionControl.file;

import com.collaborative.editor.controller.versionControl.FileController;
import com.collaborative.editor.dto.file.FileDTO;
import com.collaborative.editor.model.file.File;
import com.collaborative.editor.service.versionControlService.fileService.FileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FileControllerTest {

    @InjectMocks
    private FileController fileController;

    @Mock
    private FileServiceImpl fileService;

    private FileDTO fileDTO;
    private File file;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        fileDTO = new FileDTO("test.txt", "room1", "project1", ".txt");
        file = new File("test.txt", "room1", "project1", "File content", System.currentTimeMillis(), System.currentTimeMillis(), ".txt");
    }

    @Test
    void listFiles() {
        when(fileService.getFiles(any())).thenReturn(Collections.singletonList(fileDTO));

        ResponseEntity<Map<String, List<FileDTO>>> response = fileController.listFiles("project1", "room1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().get("files").size());
    }

    @Test
    void listFilesNotFound() {

        when(fileService.getFiles(any())).thenReturn(Collections.emptyList());

        ResponseEntity<Map<String, List<FileDTO>>> response = fileController.listFiles("project1", "room1");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void createFile() throws Exception {

        ResponseEntity<String> response = fileController.createFile(fileDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("File created successfully!", response.getBody());
    }


    @Test
    void pullFileContent() {

        when(fileService.pullFileContent(fileDTO)).thenReturn(file);

        ResponseEntity<Map<String, File>> response = fileController.pullFileContent(fileDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(file, response.getBody().get("file"));
    }

    @Test
    void pushFile() {

        ResponseEntity<String> response = fileController.pushFile(file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("File pushed successfully!", response.getBody());
    }

    @Test
    void mergeFileContent() {

        when(fileService.mergeFileContent(file)).thenReturn(file);

        ResponseEntity<Map<String, File>> response = fileController.mergeFileContent(file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(file, response.getBody().get("file"));
    }
}
