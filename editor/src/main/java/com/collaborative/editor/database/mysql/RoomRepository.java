package com.collaborative.editor.database.mysql;

import com.collaborative.editor.model.mysql.room.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

//    @Query("SELECT r FROM Room r JOIN r. c WHERE c.email = :email")
//    Optional<List<Room>> findByOwnerEmail(@Param("email") String email);

//    @Query("SELECT r FROM Room r JOIN r.collaborators c WHERE c.email = :email")
//    Optional<List<Room>> findCollaboratingRooms(@Param("email") String email);
//
//    @Query("SELECT r FROM Room r JOIN r.viewers v WHERE v.email = :email")
//    Optional<List<Room>> findViewingRooms(@Param("email") String email);

    @Query("SELECT r FROM Room r  WHERE r.roomId = :roomId")
    Optional<Room> findByRoomId(@Param("roomId") String roomId);

    @Modifying
    @Query("DELETE FROM Room r WHERE r.roomId = :roomId")
    void deleteByRoomId(@Param("roomId") String roomId);

}
