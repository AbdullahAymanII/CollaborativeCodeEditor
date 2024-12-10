package com.collaborative.editor.repository.mysql;

import com.collaborative.editor.model.room.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

    @Query("SELECT r FROM Room r  WHERE r.roomId = :roomId")
    Optional<Room> findByRoomId(@Param("roomId") String roomId);

    @Modifying
    @Query("DELETE FROM Room r WHERE r.roomId = :roomId")
    void deleteByRoomId(@Param("roomId") String roomId);

}
