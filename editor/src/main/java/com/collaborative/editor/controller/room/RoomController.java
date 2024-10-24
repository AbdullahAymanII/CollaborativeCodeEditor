package com.collaborative.editor.controller.room;

import com.collaborative.editor.dto.room.AddMemberRequest;
import com.collaborative.editor.dto.room.RoomDTO;
import com.collaborative.editor.dto.room.CreateRoomRequest;
import com.collaborative.editor.exception.roomException.RoomCreationException;
import com.collaborative.editor.model.room.Room;
import com.collaborative.editor.model.room.RoomRole;
import com.collaborative.editor.model.user.User;
import com.collaborative.editor.service.roomMembershipService.RoomSecurityService;
import com.collaborative.editor.service.versionControlService.projectService.ProjectService;
import com.collaborative.editor.service.roomService.RoomService;
import com.collaborative.editor.service.userService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
    private final UserService userService;
    private final ProjectService projectService;
    private final RoomSecurityService roomSecurityService;

    @Autowired
    public RoomController(
            @Qualifier("RoomServiceImpl") RoomService roomService,
            @Qualifier("UserServiceImpl") UserService userService,
            @Qualifier("ProjectServiceImpl") ProjectService projectService, RoomSecurityService roomSecurityService) {

        this.roomService = roomService;
        this.userService = userService;
        this.projectService = projectService;
        this.roomSecurityService = roomSecurityService;
    }

    @PostMapping("/createRoom")
    public ResponseEntity<Map<String, String>> createRoom(@RequestBody CreateRoomRequest request) {

        System.out.println(request);
        String ownerEmail = request.getMemberEmail();
        String roomName = request.getRoomName();
        System.out.println(roomName);
        System.out.println(ownerEmail);
        try {

            User owner = userService.findUserByEmail(ownerEmail).get();
            String roomId = roomService.createRoom(owner, roomName);
            return ResponseEntity.ok(Collections.singletonMap("roomId", roomId));

        } catch (RoomCreationException e) {
            return ResponseEntity.noContent().build();
        }

    }

    @DeleteMapping("/deleteRoom")
    public ResponseEntity<String> deleteRoom(@RequestBody String roomId) {
        try {
            roomService.deleteRoom(roomId);
            return ResponseEntity.ok("Room deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add-member")
    public ResponseEntity<String> addMember(@RequestBody AddMemberRequest request) {
        String roomId = request.getRoomId();
        String memberEmail = request.getMemberEmail();
        RoomRole role = RoomRole.valueOf(request.getRole());
        try {
            User user = userService.findUserByEmail(memberEmail).get();
            Room room = roomService.getRoomById(roomId).get();

            roomService.addUserToRoom(room, user, role);

            return ResponseEntity.ok("Viewer added successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to find user!");
        }

    }

    @PostMapping("/remove-member")
    public ResponseEntity<String> removeMember(@RequestBody AddMemberRequest request) {

        try {
            String roomId = request.getRoomId();
            String memberEmail = request.getMemberEmail();
            RoomRole role = RoomRole.valueOf(request.getRole());
            User user = userService.findUserByEmail(memberEmail).get();
            Room room = roomService.getRoomById(roomId).get();

            roomService.removeUserFromRoom(room, user, role);

            return ResponseEntity.ok("Viewer removed successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to find user!");
        }
    }

    @PreAuthorize("@roomSecurityService.canViewRoom(principal.username, #roomId)")
    @PostMapping("/join-room/{roomId}")
    public ResponseEntity<String> joinRoom(@PathVariable("roomId") String roomId, @RequestBody String roomName) {
        return ResponseEntity.ok("Room");
    }

    @GetMapping("/join-room")
    public ResponseEntity<Map<String, List<RoomDTO>>> joinRoom(@RequestParam("username") String username) {
        try {

            User user = userService.findUserByEmail(username).get();

            List<RoomDTO> collaborativeRooms = roomService.getCollaborativeRooms(user);
            List<RoomDTO> viewRooms = roomService.getViewerRooms(user);

            Map<String, List<RoomDTO>> response = new HashMap<>();
            response.put("collaborativeRooms", collaborativeRooms);
            response.put("viewRooms", viewRooms);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/edit-room/{username}")
    public ResponseEntity<Map<String, List<RoomDTO>>> getOwnedRooms(@PathVariable("username") String username) {
        try {

            User owner = userService.findUserByEmail(username).get();
            List<RoomDTO> rooms = roomService.getUserOwnedRooms(owner);

            Map<String, List<RoomDTO>> response = new HashMap<>();
            response.put("rooms", rooms);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("@roomSecurityService.isOwner(principal.username, #roomId)")
    @GetMapping("/{roomId}/details")
    public ResponseEntity<Map<String, List<Object>>> getRoomDetails(@PathVariable("roomId") String roomId) {
        try {
            Room room = roomService.getRoomById(roomId).get();
            List<Object> collaborators = Collections.singletonList(roomService.getCollaborators(room));
            List<Object> viewers = Collections.singletonList(roomService.getViewers(room));
            List<Object> projects = Collections.singletonList(projectService.getProjects(room.getRoomId()));

            Map<String, List<Object>> response = new HashMap<>();
            response.put("collaborators", collaborators);
            response.put("viewers", viewers);
            response.put("projects", projects);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/rename")
    public ResponseEntity<String> renameRoom(@RequestBody RoomDTO roomDTO) {
        String roomId = roomDTO.getRoomId();
        String roomName = roomDTO.getName();
        try {
            Room room = roomService.getRoomById(roomId).get();
            room.setName(roomName);
            roomService.rename(room);
            return ResponseEntity.ok("Room renamed successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to rename room!");
        }
    }
}
