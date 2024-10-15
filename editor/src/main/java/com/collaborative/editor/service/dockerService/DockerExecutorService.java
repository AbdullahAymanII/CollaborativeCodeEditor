//
//package com.collaborative.editor.service.dockerService;
//
//import com.collaborative.editor.database.dto.code.CodeExecution;
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Service;
//
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
//import java.util.Arrays;
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//public class DockerExecutorService {
//
//    private final Map<String, String> languageDockerMap = new HashMap<>();
//
//    @PostConstruct
//    public void init() {
//        languageDockerMap.put("python", "python:3.9");
//        languageDockerMap.put("javascript", "node:14");
//        languageDockerMap.put("java", "openjdk:17");
//        languageDockerMap.put("cpp", "gcc:latest");
//        languageDockerMap.put("go", "golang:latest");
//        languageDockerMap.put("ruby", "ruby:latest");
//    }
//
//    public String executeCode(CodeExecution codeRequest) throws Exception {
//        String dockerImage = languageDockerMap.get(codeRequest.getLanguage());
//        if (dockerImage == null) {
//            throw new IllegalArgumentException("Unsupported language: " + codeRequest.getLanguage());
//        }
//
//        String[] command = {
//                "docker", "run", "--rm", dockerImage, "bash", "-c",
//                prepareCommand(
//                        codeRequest.getLanguage(),
//                        codeRequest.getCode(),
//                        codeRequest.getInput()
//                )
//        };
//
//
//        ProcessBuilder processBuilder = new ProcessBuilder(command);
//        processBuilder.redirectErrorStream(true);
//        Process process = processBuilder.start();
//
//        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//
//        StringBuilder output = new StringBuilder();
//        String line;
//        while ((line = reader.readLine()) != null) {
//            output.append(line).append("\n");
//        }
//
//        int exitCode = process.waitFor();
//        if (exitCode != 0) {
//            output.append("Error: ").append(exitCode);
//            return output.toString();
//        }
//        System.out.println(output);
//        return output.toString();
//    }
//
//    private String prepareCommand(String language, String code, String input) {
//        switch (language) {
//            case "python":
//                return String.format("echo \"%s\" | python3 -c \"%s\"", input, escapeCode(code));
//            case "javascript":
//                return String.format("echo \"%s\" | node", escapeCodeWithInput(code, input));
//            case "java":
//                return prepareJavaCommand(code, input);
//            case "cpp":
//                return prepareCppCommand(code, input);
//            case "go":
//                return String.format("echo \"%s\" > main.go && echo \"%s\" | go run main.go", escapeCode(code), input);
//            case "ruby":
//                return String.format("echo \"%s\" | ruby", escapeCodeWithInput(code, input));
//            default:
//                throw new IllegalArgumentException("Unsupported language: " + language);
//        }
//    }
//
//    private String prepareJavaCommand(String code, String input) {
//        String javaFile = "Main.java";
//        return String.format("echo \"%s\" > %s && javac %s && echo \"%s\" | java Main", escapeCode(code), javaFile, javaFile, input);
//    }
//
//    private String prepareCppCommand(String code, String input) {
//        String cppFile = "main.cpp";
//        return String.format("echo \"%s\" > %s && g++ %s -o main && echo \"%s\" | ./main", escapeCode(code), cppFile, cppFile, input);
//    }
//
//    private String escapeCodeWithInput(String code, String input) {
//        return escapeCode(code);
//    }
//
//    private String escapeCode(String code) {
//        return code.replace("\"", "\\\"").replace("$", "\\$");
//    }
//}










package com.collaborative.editor.service.dockerService;

import com.collaborative.editor.database.dto.code.CodeExecution;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@Service
public class DockerExecutorService {

    private final Map<String, String> languageDockerMap = new HashMap<>();
    private static final String DOCKER_MAPPINGS_FILE = "docker-mappings.json";

    @PostConstruct
    public void init() throws IOException {
        loadLanguageDockerMappings();
    }

    private void loadLanguageDockerMappings() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        File file = new File(DOCKER_MAPPINGS_FILE);

        if (file.exists()) {
            Map<String, String> mappings = objectMapper.readValue(file, new TypeReference<Map<String, String>>() {});
            languageDockerMap.putAll(mappings);
        } else {
            throw new IllegalStateException("Docker mappings JSON file not found: " + DOCKER_MAPPINGS_FILE);
        }
    }

    public String executeCode(CodeExecution codeRequest) throws Exception {
        String dockerImage = languageDockerMap.get(codeRequest.getLanguage());
        if (dockerImage == null) {
            throw new IllegalArgumentException("Unsupported language: " + codeRequest.getLanguage());
        }

        String[] command = {
                "docker", "run", "--rm", dockerImage, "bash", "-c",
                prepareCommand(
                        codeRequest.getLanguage(),
                        codeRequest.getCode(),
                        codeRequest.getInput()
                )
        };

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        return getProcessOutput(process);
    }

    private String getProcessOutput(Process process) throws IOException, InterruptedException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                output.append("Error: ").append(exitCode);
            }

            return output.toString();
        }
    }

    private String prepareCommand(String language, String code, String input) {
        switch (language) {
            case "python":
                return String.format("echo \"%s\" | python3 -c \"%s\"", input, escapeCode(code));
            case "javascript":
                return String.format("echo \"%s\" | node", escapeCodeWithInput(code, input));
            case "java":
                return prepareJavaCommand(code, input);
            case "cpp":
                return prepareCppCommand(code, input);
            case "go":
                return String.format("echo \"%s\" > main.go && echo \"%s\" | go run main.go", escapeCode(code), input);
            case "ruby":
                return String.format("echo \"%s\" | ruby", escapeCodeWithInput(code, input));
            default:
                throw new IllegalArgumentException("Unsupported language: " + language);
        }
    }

    private String prepareJavaCommand(String code, String input) {
        String javaFile = "Main.java";
        return String.format("echo \"%s\" > %s && javac %s && echo \"%s\" | java Main", escapeCode(code), javaFile, javaFile, input);
    }

    private String prepareCppCommand(String code, String input) {
        String cppFile = "main.cpp";
        return String.format("echo \"%s\" > %s && g++ %s -o main && echo \"%s\" | ./main", escapeCode(code), cppFile, cppFile, input);
    }

    private String escapeCodeWithInput(String code, String input) {
        return escapeCode(code);
    }

    private String escapeCode(String code) {
        return code.replace("\"", "\\\"").replace("$", "\\$");
    }
}
