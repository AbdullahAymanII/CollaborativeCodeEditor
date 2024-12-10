package com.collaborative.editor.service.versionControlService.projectService;

import com.collaborative.editor.model.file.File;
import com.collaborative.editor.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ProjectDownloadService {

    public void downloadProjectFiles(String projectName, List<File> files, HttpServletResponse response) throws IOException {
        if (files == null || files.isEmpty()) {
            throw new ResourceNotFoundException("No files found for the project");
        }

        setupResponseHeaders(response, projectName);

        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
            writeFilesToZip(files, zipOut);
        }
    }

    private void setupResponseHeaders(HttpServletResponse response, String projectName) {
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=" + projectName + ".zip");
    }

    private void writeFilesToZip(List<File> files, ZipOutputStream zipOut) throws IOException {
        for (File file : files) {
            ZipEntry zipEntry = new ZipEntry(file.getFilename() + "." + file.getExtension());
            zipOut.putNextEntry(zipEntry);
            zipOut.write(file.getContent().getBytes(StandardCharsets.UTF_8));
            zipOut.closeEntry();
        }
    }
}
