package com.collaborative.editor.repository.mysql;

import com.collaborative.editor.model.room.Room;
import com.collaborative.editor.model.room.RoomRole;
import com.collaborative.editor.model.roomMembership.RoomMembership;
import com.collaborative.editor.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMembershipRepository extends JpaRepository<RoomMembership, String> {

//    @Query("SELECT rm FROM RoomMembership rm JOIN FETCH rm.room r JOIN FETCH rm.user u WHERE r.roomId = :roomId AND u.email = :email")
//    Optional<List<RoomMembership>> findRoleByUserEmailAndRoomId(@Param("roomId") String roomId, @Param("email") String email);

    @Query("SELECT rm FROM RoomMembership rm WHERE rm.room = :room AND rm.user = :user")
    Optional<List<RoomMembership>> findRoles(@Param("room") Room room,
                                        @Param("user") User user);

    @Query("SELECT rm FROM RoomMembership rm WHERE rm.room = :room AND rm.user = :user")
    Optional<RoomMembership> findByRoomAndUser(Room room, User user);

    @Query("SELECT rm FROM RoomMembership rm WHERE rm.user.email = :username")
    Optional<List<RoomMembership>> findByUser(@Param("username") String username);

    @Query("SELECT rm FROM RoomMembership rm WHERE rm.room = :room AND rm.user = :user AND rm.role = :role")
    Optional<RoomMembership> findByRole(@Param("room") Room room,
                                        @Param("user") User user,
                                        @Param("role") RoomRole role);
}
