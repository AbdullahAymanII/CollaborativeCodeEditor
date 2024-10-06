//package com.collaborative.editor.service.dockerService;
//
//import com.collaborative.editor.model.mysql.code.CodeRequestDTO;
//import jakarta.annotation.PostConstruct;
//import org.springframework.stereotype.Service;
//
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
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
//
//    public String executeCode(CodeRequestDTO codeRequest) throws Exception {
//        String dockerImage = languageDockerMap.get(codeRequest.getLanguage());
//        if (dockerImage == null) {
//            throw new IllegalArgumentException("Unsupported language: " + codeRequest.getLanguage());
//        }
//
//
//        String[] command = {
//                "docker", "run", "--rm", dockerImage, "bash", "-c", prepareCommand(codeRequest.getLanguage(), codeRequest.getCode())
//        };
//
//        System.out.println(command);
//
//        ProcessBuilder processBuilder = new ProcessBuilder(command);
//        processBuilder.redirectErrorStream(true);
//        System.out.println("=================================================");
//
//        Process process = processBuilder.start();
//        System.out.println("1000000000000000000000000000000000000000000000000000000000000000");
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
//            throw new Exception("Error occurred during code execution. Exit code: " + exitCode);
//        }
//
//        return output.toString();
//    }
//
//    private String prepareCommand(String language, String code) {
//        switch (language) {
//            case "python":
//                return String.format("echo \"%s\" | python3", escapeCode(code));
//            case "javascript":
//                return String.format("echo \"%s\" | node", escapeCode(code));
//            case "java":
//                return prepareJavaCommand(code);
//            case "cpp":
//                return prepareCppCommand(code);
//            case "go":
//                return String.format("echo \"%s\" > main.go && go run main.go", escapeCode(code));
//            case "ruby":
//                return String.format("echo \"%s\" | ruby", escapeCode(code));
//            default:
//                throw new IllegalArgumentException("Unsupported language: " + language);
//        }
//    }
//
//    private String prepareJavaCommand(String code) {
//        String javaFile = "Main.java";
//        return String.format("echo \"%s\" > %s && javac %s && java Main", escapeCode(code), javaFile, javaFile);
//    }
//
//    private String prepareCppCommand(String code) {
//        String cppFile = "main.cpp";
//        return String.format("echo \"%s\" > %s && g++ %s -o main && ./main", escapeCode(code), cppFile, cppFile);
//    }
//
//    private String escapeCode(String code) {
//        return code.replace("\"", "\\\"").replace("$", "\\$");
//    }
//}


package com.collaborative.editor.service.dockerService;

import com.collaborative.editor.model.mysql.code.CodeRequestDTO;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class DockerExecutorService {

    private final Map<String, String> languageDockerMap = new HashMap<>();

    @PostConstruct
    public void init() {
        languageDockerMap.put("python", "python:3.9");
        languageDockerMap.put("javascript", "node:14");
        languageDockerMap.put("java", "openjdk:17");
        languageDockerMap.put("cpp", "gcc:latest");
        languageDockerMap.put("go", "golang:latest");
        languageDockerMap.put("ruby", "ruby:latest");
    }

    public String executeCode(CodeRequestDTO codeRequest) throws Exception {
        String dockerImage = languageDockerMap.get(codeRequest.getLanguage());
        if (dockerImage == null) {
            throw new IllegalArgumentException("Unsupported language: " + codeRequest.getLanguage());
        }

        String[] command = {
                "docker", "run", "--rm", dockerImage, "bash", "-c", prepareCommand(codeRequest.getLanguage(), codeRequest.getCode(), codeRequest.getInput())
        };
        System.out.println(Arrays.toString(command));
        System.out.println(codeRequest.getCode());

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        System.out.println("=================================================");

        Process process = processBuilder.start();
        System.out.println("Executing...");
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
            System.out.println(line);
        }
        System.out.println("Successfully executed");

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            output.append("Error: ").append(exitCode);
            return output.toString();
//            return "Error occurred during code execution. Exit code: " + exitCode;
//            throw new Exception("Error occurred during code execution. Exit code: " + exitCode);
        }
        System.out.println(output);
        return output.toString();
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
        // Here we can just pass the code to the container and provide the input via stdin
        return escapeCode(code);  // Input will be passed separately
    }

    private String escapeCode(String code) {
        return code.replace("\"", "\\\"").replace("$", "\\$");
    }
}

