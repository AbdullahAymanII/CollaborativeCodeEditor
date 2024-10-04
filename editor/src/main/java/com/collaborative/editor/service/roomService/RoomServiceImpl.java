package com.collaborative.editor.service.roomService;

import com.collaborative.editor.database.mysql.RoomMembershipRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.room.RoomDTO;
import com.collaborative.editor.model.mysql.room.RoomMembership;
import com.collaborative.editor.model.mysql.room.RoomRole;
import com.collaborative.editor.model.mysql.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;
import java.util.stream.Collectors;

@Service("RoomServiceImpl")
public class RoomServiceImpl implements RoomService{

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMembershipRepository roomMembershipRepository;

    @Override
    public void createRoom(User owner, String roomName, String roomId) {
        try {
            Room room = new Room();
            room.setRoomId(Long.parseLong(roomId));
            room.setName(roomName);
            room.setOwner(owner);
            roomRepository.save(room);
        } catch (Exception e){
            throw new RuntimeException("Failed to create room.");
        }
    }

    @Override
    public Optional<Room> findByRoomId(Long roomId) {
        try {
            return roomRepository.findByRoomId(roomId);
        }catch (Exception e) {
            return Optional.empty();
        }
    }
    @Transactional
    @Override
    public boolean deleteByRoomId(Long roomId) {
        try {
            roomRepository.deleteByRoomId(roomId);
            return true;
        } catch (Exception e)
        {
            return false;
        }
    }

    @Override
    public boolean addUserToRoom(Room room, User user, RoomRole role) {
        try {
            Optional<RoomMembership> existingMembership = roomMembershipRepository.findByRoomAndUser(room, user);

            if (existingMembership.isPresent()) {
                RoomMembership membership = existingMembership.get();
                membership.setRole(role);  // Assuming single role per membership
                roomMembershipRepository.save(membership);
            } else {
                RoomMembership newMembership = new RoomMembership(room, user, role);
                room.getRoomMemberships().add(newMembership);
                user.getRoomMemberships().add(newMembership);
                roomMembershipRepository.save(newMembership);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<RoomDTO> findByCollaborativeUserName(User user) {
        return user.getRoomMemberships().stream()
                .filter(rm -> rm.getRole() == RoomRole.COLLABORATOR)
                .map(RoomMembership::getRoom)
                .toList().stream()
                .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomDTO> findByViewerUserName(User user) {
        return user.getRoomMemberships().stream()
                .filter(rm -> rm.getRole() == RoomRole.VIEWER)
                .map(RoomMembership::getRoom)
                .toList().stream()
                .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                .collect(Collectors.toList());
    }

}
