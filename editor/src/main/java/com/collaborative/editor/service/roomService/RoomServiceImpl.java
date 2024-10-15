package com.collaborative.editor.service.roomService;

import com.collaborative.editor.database.dto.room.RoomDTO;
import com.collaborative.editor.database.mysql.ProjectRepository;
import com.collaborative.editor.database.mysql.RoomMembershipRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.database.mysql.UserRepository;
import com.collaborative.editor.exception.RoomMembershipNotFoundException;
import com.collaborative.editor.model.mysql.project.Project;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.roomMembership.RoomMembership;
import com.collaborative.editor.model.mysql.room.RoomRole;
import com.collaborative.editor.model.mysql.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

@Service("RoomServiceImpl")
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMembershipRepository roomMembershipRepository;

    @Autowired
    private UserRepository userRepository;

    private Lock lock = new ReentrantLock();
    @Autowired
    private ProjectRepository projectRepository;

    @Override
    @Transactional
    public String createRoom(User owner, String roomName) {
        try {
            String roomId = UUID.randomUUID().toString();

            Room room = new Room();
            room.setRoomId(roomId);
            room.setName(roomName);
            roomRepository.save(room);
            addUserToRoom(room, owner, RoomRole.OWNER);

            return roomId;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create room.");
        }
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<Room> getRoomById(String roomId) {
        try {
            return roomRepository.findByRoomId(roomId);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    @Override
    public void deleteRoom(String roomId) {
        try {

            if (roomRepository.findByRoomId(roomId).isEmpty())
                throw new RuntimeException("Invalid room");

            roomRepository.deleteByRoomId(roomId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete room.");
        }
    }

    @Override
    public void addUserToRoom(Room room, User user, RoomRole role) {
        try {
//                Room.builder().roomId(room.getRoomId())
//            Project.builder().name(projectRepository)
                lock.lock();
                RoomMembership newMembership = new RoomMembership();
                newMembership.setRoom(room);
                newMembership.setUser(user);
                newMembership.setRole(role);

                room.getRoomMemberships().add(newMembership);
                user.getRoomMemberships().add(newMembership);
                roomMembershipRepository.save(newMembership);

        } catch (Exception e) {
            throw new RuntimeException("Failed to add user to room.");
        } finally {
            lock.unlock();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getCollaborativeRooms(User user) {
        return user.getRoomMemberships().stream()
                .filter(rm -> rm.getRole() == RoomRole.COLLABORATOR)
                .map(RoomMembership::getRoom)
                .toList().stream()
                .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getViewerRooms(User user) {
        return user.getRoomMemberships().stream()
                .filter(rm -> rm.getRole() == RoomRole.VIEWER)
                .map(RoomMembership::getRoom)
                .toList().stream()
                .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomDTO> getUserOwnedRooms(User user) {
        Optional<List<RoomMembership>> roomMemberships = roomMembershipRepository.findByUser(user.getEmail());

        return roomMemberships.map(memberships -> memberships.stream()
                .filter(rm -> rm.getRole() == RoomRole.OWNER)
                .map(RoomMembership::getRoom)
                .toList().stream()
                .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                .collect(Collectors.toList())).orElse(Collections.emptyList());

    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getViewers(Room room) {
        return room.getRoomMemberships().stream()
               .filter(rm -> rm.getRole() == RoomRole.VIEWER)
               .map(RoomMembership::getUser)
               .map(User::getEmail)
               .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getCollaborators(Room room) {
        return room.getRoomMemberships().stream()
               .filter(rm -> rm.getRole() == RoomRole.COLLABORATOR)
               .map(RoomMembership::getUser)
               .map(User::getEmail)
               .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void removeUserFromRoom(Room room, User user, RoomRole role) {
        try {
            Optional<RoomMembership> existingMembership = roomMembershipRepository.findByRole(room, user, role);
            if (existingMembership.isEmpty()) {
                throw new RoomMembershipNotFoundException("Room membership for user " + user.getUsername() + " does not exist  in  room " + room.getName());
            }

                RoomMembership membership = existingMembership.get();
                room.getRoomMemberships().remove(membership);
                user.getRoomMemberships().remove(membership);
                roomMembershipRepository.delete(membership);

        } catch (Exception e) {
            throw new RuntimeException("Failed to remove user from room.");
        }
    }


    @Override
    @Transactional
    public void rename(Room room) {
        try {
            lock.lock();
            roomRepository.save(room);
        } catch (Exception e) {
            throw new RuntimeException("Failed to rename room.");
        } finally {
            lock.unlock();
        }
    }

}
