//package com.collaborative.editor.service.dockerService;
//
//
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
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
//    public String executeCode(String language, String code) throws Exception {
//        String dockerImage = languageDockerMap.get(language);
//        System.out.println(dockerImage);
//        if (dockerImage == null) {
//            throw new IllegalArgumentException("Unsupported language: " + language);
//        }
//        System.out.println(dockerImage+"_________--------------------");
//        // Prepare the code execution command in Docker
//        String[] command = {
//                "D:\\Docker\\resources\\bin\\docker.exe", "run", "--rm", dockerImage, "bash", "-c", prepareCommand(language, code)
//        };
//        System.out.println(Arrays.toString(command));
//        // Use ProcessBuilder to execute the Docker command
//        ProcessBuilder processBuilder = new ProcessBuilder(command);
//        processBuilder.redirectErrorStream(true);
//        System.out.println("processBuilder.redirectErrorStream(true);");
//
//        try {
//            System.out.println("====3333333333===========================================44=============");
//            Process process = processBuilder.start();
//            System.out.println("2323232432323323232");
//        }catch (Exception e){
//            System.out.println(e.getMessage());
//            System.out.println(e);
//        }
//        Process process = processBuilder.start();
//        System.out.println("Process process = processBuilder.start();");
//        // Capture output and return it
//        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
//        System.out.println("=========================================================================");
//        StringBuilder output = new StringBuilder();
//        String line;
//
//        while ((line = reader.readLine()) != null) {
//            output.append(line).append("\n");
//            System.out.println("=========================="+line);
//        }
//
//        int exitCode = process.waitFor();
//        System.out.println("2322222222222222222222222222222222222222222222222222222222222");
//        if (exitCode != 0) {
//            System.out.println("4399999999999999999999999999999999999999999999999999999999999999999999");
//            throw new Exception("Error occurred during code execution. Exit code: " + exitCode);
//        }
//        System.out.println("sdaskdnj;alsdfhn;ldksahfaaaafafafafafafafafafafafafafafafafafafafafafafafafafafafafafafa");
//        return output.toString();
//    }
//
//    // Prepare the Docker command based on language
//    private String prepareCommand(String language, String code) {
//        switch (language) {
//            case "python":
//                return String.format("\"%s\" | python3", code);
//            case "javascript":
//                return String.format("echo \"%s\" | node", code);
//            case "java":
//                return prepareJavaCommand(code);
//            case "cpp":
//                return prepareCppCommand(code);
//            case "go":
//                return String.format("echo \"%s\" > main.go && go run main.go", code);
//            case "ruby":
//                return String.format("echo \"%s\" | ruby", code);
//            default:
//                throw new IllegalArgumentException("Unsupported language: " + language);
//        }
//    }
//
//    private String prepareJavaCommand(String code) {
//        // For Java, we will need to handle the compilation and execution separately
//        String javaFile = "Main.java";
//        return String.format("echo \"%s\" > %s && javac %s && java Main", code, javaFile, javaFile);
//    }
//
//    private String prepareCppCommand(String code) {
//        // For C++, we will compile the code and run the executable
//        String cppFile = "main.cpp";
//        return String.format("echo \"%s\" > %s && g++ %s -o main && ./main", code, cppFile, cppFile);
//    }
//}



package com.collaborative.editor.service.dockerService;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class DockerExecutorService {

    // Mapping languages to Docker images
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

    // Executes code inside Docker containers
    public String executeCode(String language, String code) throws Exception {
        String dockerImage = languageDockerMap.get(language);
        if (dockerImage == null) {
            throw new IllegalArgumentException("Unsupported language: " + language);
        }

        // Prepare the Docker command for code execution
        String[] command = {
                "docker", "run", "--rm", dockerImage, "bash", "-c", prepareCommand(language, code)
        };

        System.out.println(command);

        // Use ProcessBuilder to execute the Docker command
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        System.out.println("=================================================");
        // Start the process and capture the output
        Process process = processBuilder.start();
        System.out.println("1000000000000000000000000000000000000000000000000000000000000000");
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new Exception("Error occurred during code execution. Exit code: " + exitCode);
        }

        return output.toString();
    }

    // Prepare the Docker command based on language
    private String prepareCommand(String language, String code) {
        switch (language) {
            case "python":
                return String.format("echo \"%s\" | python3", escapeCode(code));
            case "javascript":
                return String.format("echo \"%s\" | node", escapeCode(code));
            case "java":
                return prepareJavaCommand(code);
            case "cpp":
                return prepareCppCommand(code);
            case "go":
                return String.format("echo \"%s\" > main.go && go run main.go", escapeCode(code));
            case "ruby":
                return String.format("echo \"%s\" | ruby", escapeCode(code));
            default:
                throw new IllegalArgumentException("Unsupported language: " + language);
        }
    }

    private String prepareJavaCommand(String code) {
        // For Java, we will need to handle the compilation and execution separately
        String javaFile = "Main.java";
        return String.format("echo \"%s\" > %s && javac %s && java Main", escapeCode(code), javaFile, javaFile);
    }

    private String prepareCppCommand(String code) {
        // For C++, we will compile the code and run the executable
        String cppFile = "main.cpp";
        return String.format("echo \"%s\" > %s && g++ %s -o main && ./main", escapeCode(code), cppFile, cppFile);
    }

    // Escapes special characters in code to avoid shell issues
    private String escapeCode(String code) {
        return code.replace("\"", "\\\"").replace("$", "\\$");
    }
}
