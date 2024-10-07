package com.collaborative.editor.service.roomService;


import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.room.RoomDTO;
import com.collaborative.editor.model.mysql.room.RoomRole;
import com.collaborative.editor.model.mysql.user.User;

import java.util.List;
import java.util.Optional;

public interface RoomService {
    void createRoom(User owner, String roomName, String roomId);

    Optional<Room> findByRoomId(Long roomId);

    void deleteByRoomId(Long roomId);

//    boolean addCollaborator(Long roomId, User user);
//
//    boolean addViewer(Long roomId, User user);

    void addUserToRoom(Room room, User user, RoomRole role);

    List<RoomDTO> findByCollaborativeUserName(User user);

    List<RoomDTO> findByViewerUserName(User user);

    List<RoomDTO> findByOwnerUsername(User user);

    List<String> getViewers(Room room);

    List<String> getCollaborators(Room room);

    void removeUserFromRoom(Room room, User user);

    void rename(Room room);
}
