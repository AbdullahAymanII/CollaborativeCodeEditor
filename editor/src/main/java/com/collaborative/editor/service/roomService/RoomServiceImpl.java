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
            System.out.println("999999999999999999999999999999999999999999999");
            addUserToRoom(room, owner, RoomRole.OWNER);
            System.out.println("33333333333333333333333333333333333333333333333333333");
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
            System.out.println("222222222222222222222222222222222222222222222222222222222");
            if (existingMembership.isPresent()) {
                RoomMembership membership = existingMembership.get();
                membership.setRole(role);  // Assuming single role per membership
                roomMembershipRepository.save(membership);
            } else {
                RoomMembership newMembership = new RoomMembership(room, user, role);
                room.getRoomMemberships().add(newMembership);
                user.getRoomMemberships().add(newMembership);
                System.out.println("1111111111111111111111111111111111111111111111111111111");
                roomMembershipRepository.save(newMembership);
                System.out.println("1111111111111111111111111111111111111111111111111111111");
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
        System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++");
        if (roomMemberships.isPresent()) {
            System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++++");
            return roomMemberships.get().stream()
                    .filter(rm -> rm.getRole() == RoomRole.OWNER)
                    .map(RoomMembership::getRoom)
                    .toList().stream()
                    .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                    .collect(Collectors.toList());
        } else
            return Collections.emptyList();

    }

}
