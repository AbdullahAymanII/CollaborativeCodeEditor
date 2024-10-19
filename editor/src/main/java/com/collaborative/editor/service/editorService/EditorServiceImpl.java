package com.collaborative.editor.service.editorService;


import com.collaborative.editor.dto.code.CodeDTO;
import com.collaborative.editor.dto.code.CodeMetrics;
import com.collaborative.editor.model.codeUpdate.CodeUpdate;
import com.collaborative.editor.model.file.File;
import com.collaborative.editor.repository.mongodb.CodeUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service("EditorServiceImpl")
public class EditorServiceImpl implements EditorService {

    @Autowired
    private CodeUpdateRepository codeUpdateRepository;
    
    private final Map<String, Object> CodeLocks = new ConcurrentHashMap<>();


    @Override
    public CodeUpdate insertComment(CodeUpdate codeUpdate) {
        String fileKey = codeUpdate.getRoomId() + "-" + codeUpdate.getProjectName() + "-" + codeUpdate.getFilename();

        synchronized (getCodeLock(fileKey)) {

            String code = codeUpdate.getCode();
            int lineNumber = Integer.parseInt(codeUpdate.getLineNumber());
            String comment = codeUpdate.getLineContent();

            String[] lines = code.split("\n");
            int targetLine = lineNumber - 1;

            if (targetLine >= 0 && targetLine < lines.length) {
                String lineContent = lines[targetLine];

                if (lineContent.trim().isEmpty()) {
                    lines[targetLine] = "//" + comment;
                } else {
                    lines[targetLine] = lineContent.trim() + " //" + comment;
                }
            }

            String updatedCode = String.join("\n", lines);
            codeUpdate.setCode(updatedCode);

            return codeUpdate;
        }
    }

    @Override
    public void saveCodeUpdate(CodeUpdate codeUpdate) {

        String codeKey = codeUpdate.getRoomId() + "-" + codeUpdate.getProjectName() + "-" + codeUpdate.getFilename();

        synchronized (getCodeLock(codeKey)) {
            updateCode(codeUpdate);
        }

    }

    void updateCode(CodeUpdate codeUpdate){
        if (checkExistingCodeUpdate(codeUpdate).isEmpty()) {
            codeUpdateRepository.save(codeUpdate);
        } else {
            codeUpdateRepository.updateCode(
                    codeUpdate.getFilename(),
                    codeUpdate.getProjectName(),
                    codeUpdate.getRoomId(),
                    codeUpdate.getCode(),
                    codeUpdate.getUserId(),
                    codeUpdate.getLineNumber(),
                    codeUpdate.getColumn(),
                    codeUpdate.getLineContent()
            );
        }
    }

    @Override
    public CodeMetrics calculateMetrics(String code, String language) {
        int lines = code.split("\n").length;
        int functions = countFunctions(code, language);
        int variables = countVariables(code, language);
        int cyclomaticComplexity = calculateCyclomaticComplexity(code, language);

        return new CodeMetrics(lines, functions, variables, cyclomaticComplexity);
    }

    private int countFunctions(String code, String language) {
        switch (language.toLowerCase()) {
            case "java":
                return code.split("\\bpublic\\b|\\bprivate\\b|\\bprotected\\b").length - 1;
            case "python":
                return code.split("\\bdef\\b").length - 1;
            default:
                return 0;
        }
    }

    private int countVariables(String code, String language) {
        switch (language.toLowerCase()) {
            case "java":
                return code.split("\\bint\\b|\\bString\\b|\\bdouble\\b|\\bboolean\\b").length - 1;
            case "python":
                return code.split("\\b=\\b").length - 1;
            default:
                return 0;
        }
    }

    private int calculateCyclomaticComplexity(String code, String language) {
        String[] controlFlowKeywords;

        switch (language.toLowerCase()) {
            case "java":
                controlFlowKeywords = new String[]{"if", "else", "for", "while", "switch", "case", "catch"};
                break;
            case "python":
                controlFlowKeywords = new String[]{"if", "elif", "else", "for", "while", "try", "except"};
                break;
            default:
                controlFlowKeywords = new String[]{};
        }

        int complexity = 1;
        for (String keyword : controlFlowKeywords) {
            complexity += code.split("\\b" + keyword + "\\b").length - 1;
        }

        return complexity;
    }

    private Optional<CodeUpdate> checkExistingCodeUpdate(CodeUpdate codeUpdate) {
        return codeUpdateRepository.findByFileNameProjectNameAndRoomId(
                codeUpdate.getProjectName(),
                codeUpdate.getFilename(),
                codeUpdate.getRoomId()
        );
    }

    private Object getCodeLock(String fileKey) {
        return CodeLocks.computeIfAbsent(fileKey, k -> new Object());
    }
}
