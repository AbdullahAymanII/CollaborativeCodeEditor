package com.collaborative.editor.service.roomService;

import com.collaborative.editor.database.mysql.RoomMembershipRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.database.mysql.UserRepository;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.room.RoomDTO;
import com.collaborative.editor.model.mysql.room.RoomMembership;
import com.collaborative.editor.model.mysql.room.RoomRole;
import com.collaborative.editor.model.mysql.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service("RoomServiceImpl")
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMembershipRepository roomMembershipRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void createRoom(User owner, String roomName, String roomId) {
        try {
            Room room = new Room();
            room.setRoomId(Long.parseLong(roomId));
            room.setName(roomName);
            room.setOwner(owner);
            roomRepository.save(room);

            addUserToRoom(room, owner, RoomRole.OWNER);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create room.");
        }
    }

    @Override
    public Optional<Room> findByRoomId(Long roomId) {
        try {
            return roomRepository.findByRoomId(roomId);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    @Override
    public void deleteByRoomId(Long roomId) {
        try {
            roomRepository.deleteByRoomId(roomId);
        } catch (Exception e) {
        }
    }

    @Override
    public void addUserToRoom(Room room, User user, RoomRole role) {
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
        } catch (Exception e) {
            e.printStackTrace();
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

    @Override
    public List<RoomDTO> findByOwnerUsername(User user) {
        Optional<List<RoomMembership>> roomMemberships = roomMembershipRepository.findByUser(user.getEmail());

        return roomMemberships.map(memberships -> memberships.stream()
                .filter(rm -> rm.getRole() == RoomRole.OWNER)
                .map(RoomMembership::getRoom)
                .toList().stream()
                .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                .collect(Collectors.toList())).orElse(Collections.emptyList());

    }

    @Override
    public List<String> getViewers(Room room) {
        return room.getRoomMemberships().stream()
               .filter(rm -> rm.getRole() == RoomRole.VIEWER)
               .map(RoomMembership::getUser)
               .map(User::getEmail)
               .collect(Collectors.toList());
    }

    @Override
    public List<String> getCollaborators(Room room) {
        return room.getRoomMemberships().stream()
               .filter(rm -> rm.getRole() == RoomRole.COLLABORATOR)
               .map(RoomMembership::getUser)
               .map(User::getEmail)
               .collect(Collectors.toList());
    }

    @Override
    public void removeUserFromRoom(Room room, User user) {
        try {
            System.out.println("Removing member++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            Optional<RoomMembership> existingMembership = roomMembershipRepository.findByRoomAndUser(room, user);
            System.out.println("Removing member++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            existingMembership.ifPresent(roomMembership -> roomMembershipRepository.delete(roomMembership));
            System.out.println("Removing member++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove user from room.");
        }
    }

    @Override
    public void rename(Room room) {
        try {
            roomRepository.save(room);
        } catch (Exception e) {
            throw new RuntimeException("Failed to rename room.");
        }
    }

}
