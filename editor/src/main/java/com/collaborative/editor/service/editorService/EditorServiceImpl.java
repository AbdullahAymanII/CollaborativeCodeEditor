package com.collaborative.editor.service.editorService;

import com.collaborative.editor.model.mysql.code.CodeMetrics;
import org.springframework.stereotype.Service;

@Service("EditorServiceImpl")
public class EditorServiceImpl implements EditorService {
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
}
