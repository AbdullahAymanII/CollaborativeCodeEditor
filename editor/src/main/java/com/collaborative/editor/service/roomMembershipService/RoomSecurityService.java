package com.collaborative.editor.service.roomMembershipService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomSecurityService {

    @Autowired
    private RoomMembershipService roomMembershipService;

    public boolean isOwner(String userEmail, String roomId) {
        return roomMembershipService.isOwner(userEmail, roomId);
    }


    public boolean canViewRoom(String userEmail, String roomId) {
        return roomMembershipService.isOwner(userEmail, roomId) ||
                roomMembershipService.isCollaborator(userEmail, roomId) ||
                roomMembershipService.isViewer(userEmail, roomId);
    }
}
