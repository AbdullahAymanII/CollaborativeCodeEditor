package com.collaborative.editor.service.editorService;


import com.collaborative.editor.dto.code.CodeDTO;
import com.collaborative.editor.dto.code.CodeMetrics;

public interface EditorService {
    CodeMetrics calculateMetrics(String code, String language);
    CodeDTO insertComment(CodeDTO codeDTO);
}
