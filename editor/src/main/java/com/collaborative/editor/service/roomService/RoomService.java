package com.collaborative.editor.service.roomService;

import com.collaborative.editor.dto.room.RoomDTO;
import com.collaborative.editor.model.room.Room;
import com.collaborative.editor.model.room.RoomRole;
import com.collaborative.editor.model.user.User;

import java.util.List;
import java.util.Optional;

public interface RoomService {
    String createRoom(User owner, String roomName);

    Optional<Room> getRoomById(String roomId);

    void deleteRoom(String roomId);

    void addUserToRoom(Room room, User user, RoomRole role);

    List<RoomDTO> getCollaborativeRooms(User user);

    List<RoomDTO> getViewerRooms(User user);

    List<RoomDTO> getUserOwnedRooms(User user);

    List<String> getViewers(Room room);

    List<String> getCollaborators(Room room);

    void removeUserFromRoom(Room room, User user, RoomRole role);

    void rename(Room room);
}
