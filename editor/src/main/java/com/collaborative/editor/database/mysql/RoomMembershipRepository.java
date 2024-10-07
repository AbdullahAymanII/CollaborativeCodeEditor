package com.collaborative.editor.database.mysql;

import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.room.RoomMembership;
import com.collaborative.editor.model.mysql.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMembershipRepository extends JpaRepository<RoomMembership, Long> {

    @Query("SELECT rm FROM RoomMembership rm WHERE rm.room = :room AND rm.user = :user")
    Optional<RoomMembership> findByRoomAndUser(Room room, User user);

    @Query("SELECT rm FROM RoomMembership rm WHERE rm.user.email = :username")
    Optional<List<RoomMembership>> findByUser(@Param("username") String username);
}
