package com.collaborative.editor.service.editorService;

import com.collaborative.editor.model.mongodb.Comment;

public interface CommentService {

    void saveComment(Comment comment);
}
