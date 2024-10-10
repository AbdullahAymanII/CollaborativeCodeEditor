package com.collaborative.editor.controller.versionControl;

import com.collaborative.editor.database.dto.file.FileDTO;
import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.exception.FileAlreadyExistsException;
import com.collaborative.editor.exception.FileNotFoundException;
import com.collaborative.editor.model.mongodb.File;
import com.collaborative.editor.service.fileService.FileServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//@RestController
//@RequestMapping("/api/files")
//@CrossOrigin
//public class VersionController {
//
//
//    private final FileServiceImpl fileService;
//
//    public VersionController(@Qualifier("FileServiceImpl") FileServiceImpl fileService) {
//        this.fileService = fileService;
//    }
//
//
//    @GetMapping("/list-files/{projectName}/{roomId}")
//    public ResponseEntity<Map<String, List<FileDTO>>> listFiles(@PathVariable String projectName, @PathVariable String roomId) {
//
//        List<FileDTO> files = fileService.getFiles(new ProjectDTO(projectName, Long.parseLong(roomId)));
//
//        if (files.isEmpty())
//            return ResponseEntity.notFound().build();
//        else
//            return ResponseEntity.ok(Map.of("files", files));
//    }
//
//    @PostMapping("/create-file")
//    public ResponseEntity<String> createFile(@RequestBody FileDTO fileDTO) {
//        try {
//            fileService.createFile(fileDTO);
//            return ResponseEntity.ok("File created successfully!");
//        }catch (Exception e) {
//            return ResponseEntity.badRequest().body("Failed to create file: " + e.getMessage());
//        }
//    }
//
//    @PostMapping("/pull-file-content")
//    public ResponseEntity<Map<String, File>> pullFileContent(@RequestBody FileDTO fileDTO) {
//        try {
//
//            File pulledFile = fileService.pullFileContent(fileDTO);
//
//            return ResponseEntity.ok(Map.of("file", pulledFile));
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//
//    @PostMapping("/push-file-content")
//    public ResponseEntity<String> pushFile(@RequestBody File file) {
//        System.out.println(file);
//        try {
//            fileService.pushFileContent(file);
//            return ResponseEntity.ok("File pushed successfully!");
//        }catch (Exception e) {
//            return ResponseEntity.badRequest().body("Failed to push file content: " + e.getMessage());
//        }
//    }
//
//    @PostMapping("/merge-file-content")
//    public ResponseEntity<Map<String, File>> mergeFileContent(@RequestBody File file) {
//        try {
//
//            File conflictVersion = fileService.mergeFileContent(file);
//
//            return ResponseEntity.ok(Map.of("file", conflictVersion));
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//}


@RestController
@RequestMapping("/api/files")
@CrossOrigin
public class VersionController {

    private final FileServiceImpl fileService;

    public VersionController(@Qualifier("FileServiceImpl") FileServiceImpl fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/list-files/{projectName}/{roomId}")
    public ResponseEntity<Map<String, List<FileDTO>>> listFiles(@PathVariable String projectName, @PathVariable String roomId) {
        List<FileDTO> files = fileService.getFiles(new ProjectDTO(projectName, roomId));

        if (files.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of("files", files));
    }

    @PostMapping("/create-file")
    public ResponseEntity<String> createFile(@RequestBody FileDTO fileDTO) {
        try {
            fileService.createFile(fileDTO);
            return ResponseEntity.ok("File created successfully!");
        } catch (FileAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("File already exists: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating file: " + e.getMessage());
        }
    }

    @PostMapping("/pull-file-content")
    public ResponseEntity<Map<String, File>> pullFileContent(@RequestBody FileDTO fileDTO) {
        try {
            File pulledFile = fileService.pullFileContent(fileDTO);
            return ResponseEntity.ok(Map.of("file", pulledFile));
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/push-file-content")
    public ResponseEntity<String> pushFile(@RequestBody File file) {
        try {
            fileService.pushFileContent(file);
            return ResponseEntity.ok("File pushed successfully!");
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error pushing file content: " + e.getMessage());
        }
    }

    @PostMapping("/merge-file-content")
    public ResponseEntity<Map<String, File>> mergeFileContent(@RequestBody File file) {
        try {
            File conflictVersion = fileService.mergeFileContent(file);
            return ResponseEntity.ok(Map.of("file", conflictVersion));
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}