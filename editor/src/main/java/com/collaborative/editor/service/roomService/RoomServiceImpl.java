package com.collaborative.editor.service.roomService;

import com.collaborative.editor.dto.file.FileDTO;
import com.collaborative.editor.dto.project.ProjectDTO;
import com.collaborative.editor.dto.room.RoomDTO;
import com.collaborative.editor.repository.mysql.RoomMembershipRepository;
import com.collaborative.editor.repository.mysql.RoomRepository;
import com.collaborative.editor.exception.roomException.RoomCreationException;
import com.collaborative.editor.exception.roomException.RoomMembershipNotFoundException;
import com.collaborative.editor.exception.roomException.RoomNotFoundException;
import com.collaborative.editor.model.room.Room;
import com.collaborative.editor.model.roomMembership.RoomMembership;
import com.collaborative.editor.model.room.RoomRole;
import com.collaborative.editor.model.user.User;
import com.collaborative.editor.service.versionControlService.fileService.FileService;
import com.collaborative.editor.service.versionControlService.projectService.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service("RoomServiceImpl")
public class RoomServiceImpl implements RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMembershipRepository roomMembershipRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private FileService fileService;

    private final Map<String, Object> roomLocks = new ConcurrentHashMap<>();


    @Override
    @Transactional
    public String createRoom(User owner, String roomName) {
        try {
            String roomId = UUID.randomUUID().toString();
            Room room = Room.builder()
                    .name(roomName)
                    .roomId(roomId)
                    .roomMemberships(new ArrayList<>())
                    .projects(new HashSet<>())
                    .build();

            roomRepository.save(room);
            addUserToRoom(room, owner, RoomRole.OWNER);

            createDefaultProject(room);
            createDefaultFile(room);
            return roomId;
        } catch (Exception e) {
            throw new RoomCreationException("Failed to create room: " + e.getMessage());
        }
    }

    private void createDefaultProject(Room room) {
        try {
            projectService.createProject(
                    ProjectDTO
                            .builder()
                            .projectName("Main-Branch")
                            .roomId(room.getRoomId())
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to create default branch: " + e.getMessage());
        }
    }

    private void createDefaultFile(Room room) {
        try {
            fileService.createFile(
                    FileDTO
                            .builder()
                            .filename("README")
                            .projectName("Main-Branch")
                            .roomId(room.getRoomId())
                            .extension(".md")
                            .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to create default file: " + e.getMessage());
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

    @Override
    @Transactional
    public void deleteRoom(String roomId) {
        synchronized (getRoomLock(roomId)) {
            Room room = roomRepository.findByRoomId(roomId)
                    .orElseThrow(() -> new RoomNotFoundException("Room not found with ID: " + roomId));

            roomRepository.deleteByRoomId(roomId);
        }
    }

    @Override
    public void addUserToRoom(Room room, User user, RoomRole role) {
        Object roomLock = getRoomLock(room.getRoomId()); // Get the lock based on roomId

        synchronized (roomLock) {
            RoomMembership newMembership = RoomMembership
                    .builder()
                    .room(room)
                    .user(user)
                    .role(role)
                    .build();

            room.getRoomMemberships().add(newMembership);
            user.getRoomMemberships().add(newMembership);
            roomMembershipRepository.save(newMembership);
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

    @Override
    @Transactional
    public void removeUserFromRoom(Room room, User user, RoomRole role) {
        Object roomLock = getRoomLock(room.getRoomId());

        synchronized (roomLock) {
            RoomMembership membership = roomMembershipRepository.findByRole(room, user, role)
                    .orElseThrow(() -> new RoomMembershipNotFoundException("Room membership not found"));

            room.getRoomMemberships().remove(membership);
            user.getRoomMemberships().remove(membership);

            roomMembershipRepository.delete(membership);
        }
    }


    @Override
    @Transactional
    public void rename(Room room) {

        Object roomLock = getRoomLock(room.getRoomId());

        synchronized (roomLock) {
            roomRepository.save(room);
        }
    }

    private Object getRoomLock(String roomId) {
        return roomLocks.computeIfAbsent(roomId, k -> new Object());
    }
}
