package com.collaborative.editor.controller.versionControl;

import com.collaborative.editor.model.mongodb.FileVersion;
import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.collaborative.editor.service.fileService.FileServiceImpl;
import com.collaborative.editor.service.projectService.ProjectServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

        List<FileDTO> files = fileService.getFiles(new ProjectDTO(projectName, Long.parseLong(roomId)));

        System.out.println(files+" dddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
        if (files.isEmpty())
            return ResponseEntity.notFound().build();
        else
            return ResponseEntity.ok(Map.of("files", files));
    }

    @PostMapping("/create-file")
    public ResponseEntity<String> createFile(@RequestBody FileDTO fileDTO) {
        try {
            fileService.createFile(fileDTO);
            return ResponseEntity.ok("File created successfully!");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create file: " + e.getMessage());
        }
    }

    @PostMapping("/pull-file-content")
    public ResponseEntity<Map<String, FileVersion>> pullFileContent(@RequestBody FileDTO fileDTO) {
        try {

            FileVersion pulledFile = fileService.pullFileContent(fileDTO);

            return ResponseEntity.ok(Map.of("file", pulledFile));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/push-file-content")
    public ResponseEntity<String> pushFile(@RequestBody FileVersion fileVersion) {
        System.out.println(fileVersion);
        try {
            fileService.pushFileContent(fileVersion);
            return ResponseEntity.ok("File pushed successfully!");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to push file content: " + e.getMessage());
        }
    }

    @PostMapping("/merge-file-content")
    public ResponseEntity<Map<String, FileVersion>> mergeFileContent(@RequestBody FileVersion fileVersion) {
        try {

            FileVersion conflictVersion = fileService.mergeFileContent(fileVersion);

            return ResponseEntity.ok(Map.of("file", conflictVersion));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}