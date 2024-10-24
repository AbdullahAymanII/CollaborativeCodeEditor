package com.collaborative.editor.service.roomMembershipService;

import com.collaborative.editor.model.room.Room;
import com.collaborative.editor.model.room.RoomRole;
import com.collaborative.editor.model.roomMembership.RoomMembership;
import com.collaborative.editor.model.user.User;
import com.collaborative.editor.repository.mysql.RoomMembershipRepository;
import com.collaborative.editor.repository.mysql.RoomRepository;
import com.collaborative.editor.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomMembershipService {

    @Autowired
    private RoomMembershipRepository roomMembershipRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean isOwner(String userEmail, String roomId) {
        return getUserRolesForRoom(userEmail, roomId).contains(RoomRole.OWNER);
    }

    public boolean isCollaborator(String userEmail, String roomId) {
        return getUserRolesForRoom(userEmail, roomId).contains(RoomRole.COLLABORATOR);
    }

    public boolean isViewer(String userEmail, String roomId) {
        return getUserRolesForRoom(userEmail, roomId).contains(RoomRole.VIEWER);
    }

    public List<RoomRole> getUserRolesForRoom(String userEmail, String roomId) {
        Room room = roomRepository.findByRoomId(roomId).get();
        User user = userRepository.findOneByEmail(userEmail).get();
        Optional<List<RoomMembership>> userRoles = roomMembershipRepository.findRoles(room, user);

        if (userRoles.isEmpty() || userRoles.get().isEmpty()) {
            throw new AccessDeniedException("User does not have access to this room");
        }

        return userRoles.get().stream()
                .map(RoomMembership::getRole)
                .collect(Collectors.toList());
    }
}
