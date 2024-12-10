package com.collaborative.editor.repository.mongodb;

import com.collaborative.editor.model.messageLog.MessageLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LogsRepository extends MongoRepository<MessageLog, Long> {


    @Query("{ 'type' : ?0, roomId: ?1 }")
    Optional<List<MessageLog>> findByType(@Param("type") String type, @Param("roomId") String roomId);

    @Query("{ 'roomId' : ?0 }")
    Optional<List<MessageLog>> findByRoomId(@Param("roomId") String roomId);

    @Query("{ 'sender' : ?0 }")
    Optional<List<MessageLog>> findBySenderEmail(@Param("sender") String sender);

    @Query("{ 'projectName' : ?0, 'filename' :?1, 'roomId' : ?2 }")
    Optional<List<MessageLog>> findByFileNameProjectNameAndRoomId(@Param("projectName") String projectName,
                                                            @Param("fileName") String filename,
                                                            @Param("roomId") String roomId
    );

    @Query("{ 'projectName' : ?0, 'roomId' :?1 }")
    Optional<List<MessageLog>> findByProjectNameAndRoomId(@Param("projectName") String projectName,
                                                            @Param("roomId") String roomId
    );
}


