package com.collaborative.editor.service.editorService;

import com.collaborative.editor.database.mongodb.CommentRepository;
import com.collaborative.editor.model.mongodb.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("CommentServiceImpl")
public class CommentServiceImpl implements CommentService{

    @Autowired
    CommentRepository commentRepository;

    @Override
    public void saveComment(Comment comment) {
        try {
            commentRepository.save(comment);
        } catch(Exception e){
          throw e;
        }

    }
}
