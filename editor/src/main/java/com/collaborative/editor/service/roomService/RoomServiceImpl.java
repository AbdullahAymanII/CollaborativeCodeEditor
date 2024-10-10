package com.collaborative.editor.service.roomService;

import com.collaborative.editor.database.dto.room.RoomDTO;
import com.collaborative.editor.database.mysql.RoomMembershipRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.database.mysql.UserRepository;
import com.collaborative.editor.exception.RoomMembershipNotFoundException;
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

    @Override
    @Transactional
    public String createRoom(User owner, String roomName) {
        try {
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
//            String roomId = UUID.randomUUID().toString();
//            Long roomId = ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE)%10000;
            String roomId = UUID.randomUUID().toString();
            System.out.println(roomId);
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            Room room = new Room();
            room.setRoomId(roomId);
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            room.setName(roomName);
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            roomRepository.save(room);
            System.out.println("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            addUserToRoom(room, owner, RoomRole.OWNER);
            System.out.println("++++++++++++++++++++++OWNER+++++++++++++++++++++++++++++++++++++++++++++++");

            return roomId;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create room.");
        }
    }


    @Override
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

        //        try {
//            Optional<RoomMembership> existingMembership = roomMembershipRepository.findByRoomAndUser(room, user);
//            if (existingMembership.isPresent()) {
//                RoomMembership membership = existingMembership.get();
//                membership.setRole(role);  // Assuming single role per membership
//                roomMembershipRepository.save(membership);
//            } else {
//                RoomMembership newMembership = new RoomMembership(room, user, role);
//                room.getRoomMemberships().add(newMembership);
//                user.getRoomMemberships().add(newMembership);
//                roomMembershipRepository.save(newMembership);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
    }

    @Override
    public List<RoomDTO> getCollaborativeRooms(User user) {
        return user.getRoomMemberships().stream()
                .filter(rm -> rm.getRole() == RoomRole.COLLABORATOR)
                .map(RoomMembership::getRoom)
                .toList().stream()
                .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<RoomDTO> getViewerRooms(User user) {
        return user.getRoomMemberships().stream()
                .filter(rm -> rm.getRole() == RoomRole.VIEWER)
                .map(RoomMembership::getRoom)
                .toList().stream()
                .map(room -> new RoomDTO(room.getRoomId(), room.getName()))
                .collect(Collectors.toList());
    }

    @Override
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
