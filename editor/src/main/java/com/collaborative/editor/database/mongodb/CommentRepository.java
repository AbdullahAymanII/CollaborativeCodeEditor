package com.collaborative.editor.database.mongodb;

import com.collaborative.editor.model.mongodb.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends MongoRepository<Comment, Long> {

    @Query("{ 'fileVersionId' : ?0 }")
    Optional<List<Comment>> findByFileVersionId(@Param("fileVersionId") Long fileVersionId);

    @Query("{ 'roomId' : ?0 }")
    Optional<List<Comment>> findByRoomId(@Param("roomId") Long roomId);

    @Query("{ 'viewerEmail' : ?0 }")
    Optional<List<Comment>> findByViewerEmail(@Param("email") String email);
}
