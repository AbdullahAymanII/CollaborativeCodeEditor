package com.collaborative.editor.controller.room;


import com.collaborative.editor.database.dto.file.FileDTO;
import com.collaborative.editor.database.dto.project.ProjectDTO;
import com.collaborative.editor.database.dto.room.AddMemberRequest;
import com.collaborative.editor.database.dto.room.RoomDTO;
import com.collaborative.editor.database.dto.room.CreateRoomRequest;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.room.RoomRole;
import com.collaborative.editor.model.mysql.user.User;
import com.collaborative.editor.service.fileService.FileServiceImpl;
import com.collaborative.editor.service.projectService.ProjectServiceImpl;
import com.collaborative.editor.service.roomService.RoomServiceImpl;
import com.collaborative.editor.service.userService.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomServiceImpl roomService;
    private final UserServiceImpl userService;
    private final ProjectServiceImpl projectService;
    private final FileServiceImpl fileService;

    @Autowired
    public RoomController(
            @Qualifier("RoomServiceImpl") RoomServiceImpl roomService,
            @Qualifier("UserServiceImpl") UserServiceImpl userService,
            @Qualifier("ProjectServiceImpl") ProjectServiceImpl projectService,
            @Qualifier("FileServiceImpl") FileServiceImpl fileService) {

        this.roomService = roomService;
        this.userService = userService;
        this.projectService = projectService;
        this.fileService = fileService;
    }

    @PostMapping("/createRoom")
    public ResponseEntity<Map<String, String>> createRoom(@RequestBody CreateRoomRequest request) {
        String ownerEmail = request.getMemberEmail();
        String roomName = request.getRoomName();

        try {
            User owner = userService.findUserByEmail(ownerEmail).get();
            String roomId = roomService.createRoom(owner, roomName);

            projectService.createProject(new ProjectDTO("Main-Branch", roomId));
            fileService.createFile(new FileDTO("Main-version", roomId, "Main-Branch", ".txt"));

            return ResponseEntity.ok(Collections.singletonMap("roomId", roomId));
        } catch (Exception e) {
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

    @PostMapping("/join-room/{roomId}")
    public ResponseEntity<String> joinRoom(@PathVariable("roomId") String roomId, @RequestBody String roomName) {
        return ResponseEntity.ok("Room");
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
