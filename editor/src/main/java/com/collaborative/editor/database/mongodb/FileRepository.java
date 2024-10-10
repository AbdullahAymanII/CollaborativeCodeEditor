package com.collaborative.editor.database.mongodb;

import com.collaborative.editor.model.mongodb.File;
//import com.collaborative.editor.model.mysql.file.File;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.mongodb.repository.Query; // Correct import for MongoDB
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends MongoRepository<File, String> {


    @Query("{ 'projectName' : ?0, 'filename' :?1, 'roomId' : ?2 }")
    Optional<File> findByFileNameProjectNameAndRoomId(@Param("projectName") String projectName,
                                                      @Param("filename") String filename,
                                                      @Param("roomId") String roomId
    );

    @Query("{ 'projectName' :?0, 'roomId' :?1 }")
    Optional<List<File>> findByProjectNameAndRoomId(@Param("projectName") String projectName, @Param("roomId") String roomId);

    @Modifying
    @Update(update = "{ 'filename' : ?0, 'projectName' : ?1, 'roomId' : ?2, 'content' : ?3 }")
    @Query(value = "{ 'filename' : ?0, 'projectName' : ?1, 'roomId' : ?2}")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    void upsertFileContent(@Param("filename") String filename,
                           @Param("projectName") String projectName,
                           @Param("roomId") String roomId,
                           @Param("content") String content);

}
