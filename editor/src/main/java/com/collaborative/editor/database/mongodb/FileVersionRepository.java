package com.collaborative.editor.database.mongodb;

import com.collaborative.editor.model.mongodb.FileVersion;
//import com.collaborative.editor.model.mysql.file.File;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.mongodb.repository.Query; // Correct import for MongoDB
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileVersionRepository extends MongoRepository<FileVersion, String> {

    @Query("{ 'roomId' : ?0 }")
    Optional<List<FileVersion>> findByRoomId(@Param("roomId") Long roomId);

    @Query("{ 'projectName' : ?0 }")
    Optional<List<FileVersion>> findByProjectName(@Param("projectName") String projectName);

    @Query("{ 'projectName' : ?0, 'filename' :?1, 'roomId' : ?2 }")
    Optional<FileVersion> findByFileNameProjectNameAndRoomId(@Param("projectName") String projectName,
                                                             @Param("fileName") String filename,
                                                            @Param("roomId") Long roomId
    );

    @Query("{ 'filename' : ?0 }")
    Optional<FileVersion> findByFileName(String filename);

    @Query("{ 'projectName' :?0, 'roomId' :?1 }")
    Optional<List<FileVersion>> findByProjectNameAndRoomId(@Param("projectName") String projectName, @Param("roomId") Long roomId);

    @Modifying
    @Update(update ="{ 'filename' : ?0, 'projectName' : ?1, 'roomId' : ?2, 'content' : ?3 }")
    @Query(value = "{ 'filename' : ?0, 'projectName' : ?1, 'roomId' : ?2}")
    void upsertFileContent(@Param("filename") String filename,
                           @Param("projectName") String projectName,
                           @Param("roomId") Long roomId,
                           @Param("content") String content);

}
