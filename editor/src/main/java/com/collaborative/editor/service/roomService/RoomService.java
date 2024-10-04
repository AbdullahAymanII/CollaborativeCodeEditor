package com.collaborative.editor.service.roomService;


import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.room.RoomDTO;
import com.collaborative.editor.model.mysql.room.RoomRole;
import com.collaborative.editor.model.mysql.user.User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface RoomService {
    void createRoom(User owner, String roomName, String roomId);

    Optional<Room> findByRoomId(Long roomId);

    boolean deleteByRoomId(Long roomId);

//    boolean addCollaborator(Long roomId, User user);
//
//    boolean addViewer(Long roomId, User user);

    boolean addUserToRoom(Room room, User user, RoomRole role);

    List<RoomDTO> findByCollaborativeUserName(User user);

    List<RoomDTO> findByViewerUserName(User user);

}
