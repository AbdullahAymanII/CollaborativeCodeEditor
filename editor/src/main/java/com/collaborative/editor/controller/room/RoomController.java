package com.collaborative.editor.controller.room;


import com.collaborative.editor.model.mysql.file.FileDTO;
import com.collaborative.editor.model.mysql.project.ProjectDTO;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.room.RoomDTO;
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

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private ProjectServiceImpl projectService;

    @Autowired
    private FileServiceImpl fileService;

    public RoomController(@Qualifier("RoomServiceImpl") RoomServiceImpl roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/createRoom")
    public ResponseEntity<String> createRoom(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        String roomName = request.get("roomName");

        try {
            User owner = userService.findUserByEmail(request.get("ownerEmail")).get();
            roomService.createRoom(owner, roomName, roomId);
            projectService.createProject(new ProjectDTO("Main-Branch", Long.parseLong(roomId)), "README");
            fileService.createFile(new FileDTO("Main-version", Long.parseLong(roomId), "Main-Branch"));
            return ResponseEntity.ok("Room created successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create room!");
        }

    }

    @DeleteMapping("/deleteRoom")
    public ResponseEntity<String> deleteRoom(@RequestBody Map<String, String> request) {
        Long id = Long.parseLong(request.get("roomId"));

        try {
            roomService.deleteByRoomId(id);
            return ResponseEntity.ok("Room deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add-collaborator")
    public ResponseEntity<String> addCollaborator(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        String email = request.get("member");

        try {
            User user = userService.findUserByEmail(email).get();
            Room room = roomService.findByRoomId(Long.parseLong(roomId)).get();
            System.out.println(user.getEmail());
            System.out.println(room.getName());
            roomService.addUserToRoom(room, user, RoomRole.COLLABORATOR);
            return ResponseEntity.ok("Viewer added successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to find user!");
        }

    }

    @PostMapping("/add-viewer")
    public ResponseEntity<String> addViewer(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        String email = request.get("member");

        try {
            User user = userService.findUserByEmail(email).get();
            Room room = roomService.findByRoomId(Long.parseLong(roomId)).get();

            roomService.addUserToRoom(room, user, RoomRole.VIEWER);

            return ResponseEntity.ok("Viewer added successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to find user!");
        }

    }

    @GetMapping("/join-room")
    public ResponseEntity<Map<String, List<RoomDTO>>> joinRoom(@RequestParam("userName") String userName) {
        try {

//            User user = userService.findUserByUsername(userName);
            User user = userService.findUserByEmail(userName).get();

            List<RoomDTO> collaborativeRooms = roomService.findByCollaborativeUserName(user);
            List<RoomDTO> viewRooms = roomService.findByViewerUserName(user);

            Map<String, List<RoomDTO>> response = new HashMap<>();
            response.put("collaborativeRooms", collaborativeRooms);
            response.put("viewRooms", viewRooms);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/join-room/{roomId}")
    public ResponseEntity<String> joinRoom(@PathVariable("roomId") Long roomId, @RequestBody String roomName) {
        return ResponseEntity.ok("Room");
    }

    @GetMapping("/edit-room/{username}")
    public ResponseEntity<Map<String, List<RoomDTO>>> getRooms(@PathVariable("username") String username) {
        try {

            User owner = userService.findUserByEmail(username).get();
            List<RoomDTO> rooms = roomService.findByOwnerUsername(owner);

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
            Room room = roomService.findByRoomId(Long.parseLong(roomId)).get();
            List<Object> collaborators = Collections.singletonList(roomService.getCollaborators(room));
            List<Object> viewers = Collections.singletonList(roomService.getViewers(room));
            List<Object> projects = Collections.singletonList(projectService.getProjects(room.getRoomId()));

            Map<String, List<Object>> response = new HashMap<>();
            response.put("collaborators", collaborators);
            response.put("viewers", viewers);
            response.put("projects", projects);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/remove-member")
    public ResponseEntity<String> removeMember(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        String email = request.get("member");
        System.out.println(roomId + " " + email);
        System.out.println("===========================");
        try {
            User user = userService.findUserByEmail(email).get();
            Room room = roomService.findByRoomId(Long.parseLong(roomId)).get();
            System.out.println("remoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooove");
            roomService.removeUserFromRoom(room, user);
            System.out.println("remoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooove");
            return ResponseEntity.ok("Viewer removed successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to find user!");
        }
    }
    @PostMapping("/rename")
    public ResponseEntity<String> renameRoom(@RequestBody Map<String, String> request) {
        String roomId = request.get("roomId");
        String roomName = request.get("newName");
        try {
            Room room = roomService.findByRoomId(Long.parseLong(roomId)).get();
            room.setName(roomName);
            roomService.rename(room);
            return ResponseEntity.ok("Room renamed successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to rename room!");
        }
    }
}
