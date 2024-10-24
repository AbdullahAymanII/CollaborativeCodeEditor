package com.collaborative.editor.service.editorService;



import com.collaborative.editor.dto.code.CodeMetrics;
import com.collaborative.editor.model.codeUpdate.CodeUpdate;

public interface EditorService {
    CodeMetrics calculateMetrics(String code, String language);
    CodeUpdate insertComment(CodeUpdate codeUpdate);
    void saveCodeUpdate(CodeUpdate codeUpdate);
}
