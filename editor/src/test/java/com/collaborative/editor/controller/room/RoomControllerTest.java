package com.collaborative.editor.controller.room;


import com.collaborative.editor.controller.authentication.SignUpController;
import com.collaborative.editor.dto.room.AddMemberRequest;
import com.collaborative.editor.dto.room.CreateRoomRequest;
import com.collaborative.editor.dto.room.RoomDTO;
import com.collaborative.editor.model.room.Room;
import com.collaborative.editor.model.room.RoomRole;
import com.collaborative.editor.model.user.User;
import com.collaborative.editor.service.versionControlService.fileService.FileServiceImpl;
import com.collaborative.editor.service.versionControlService.projectService.ProjectServiceImpl;
import com.collaborative.editor.service.roomService.RoomServiceImpl;
import com.collaborative.editor.service.userService.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoomControllerTest {

    @InjectMocks
    private RoomController roomController;

    @Mock
    private RoomServiceImpl roomService;

    @Mock
    private UserServiceImpl userService;

    @Mock
    private ProjectServiceImpl projectService;

    @Mock
    private FileServiceImpl fileService;

    private CreateRoomRequest createRoomRequest;
    private AddMemberRequest addMemberRequest;
    private User owner;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        owner = new User();
        owner.setEmail("test@example.com");

        createRoomRequest = new CreateRoomRequest();
        createRoomRequest.setMemberEmail("test@example.com");
        createRoomRequest.setRoomName("Test Room");

        addMemberRequest = new AddMemberRequest();
        addMemberRequest.setRoomId("12345");
        addMemberRequest.setMemberEmail("test@example.com");
        addMemberRequest.setRole("COLLABORATOR");
    }

    @Test
    void createRoom_success() {
        when(userService.findUserByEmail(anyString())).thenReturn(Optional.of(owner));
        when(roomService.createRoom(any(User.class), anyString())).thenReturn("roomId123");

        ResponseEntity<Map<String, String>> response = roomController.createRoom(createRoomRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals("roomId123", response.getBody().get("roomId"));
    }


    @Test
    void deleteRoom_success() {
        doNothing().when(roomService).deleteRoom(anyString());

        ResponseEntity<String> response = roomController.deleteRoom("roomId123");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Room deleted successfully!", response.getBody());
    }

    @Test
    void deleteRoom_failure() {
        doThrow(new RuntimeException()).when(roomService).deleteRoom(anyString());

        ResponseEntity<String> response = roomController.deleteRoom("roomId123");

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void addMember_success() {
        when(userService.findUserByEmail(anyString())).thenReturn(Optional.of(owner));
        when(roomService.getRoomById(anyString())).thenReturn(Optional.of(new Room()));
        doNothing().when(roomService).addUserToRoom(any(Room.class), any(User.class), any(RoomRole.class));

        ResponseEntity<String> response = roomController.addMember(addMemberRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Viewer added successfully!", response.getBody());
    }

    @Test
    void addMember_failure() {
        when(userService.findUserByEmail(anyString())).thenReturn(Optional.empty());

        ResponseEntity<String> response = roomController.addMember(addMemberRequest);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Failed to find user!", response.getBody());
    }

    @Test
    void getRoomDetails_success() {
        Room room = new Room();
        room.setRoomId("roomId123");
        when(roomService.getRoomById(anyString())).thenReturn(Optional.of(room));
        when(roomService.getCollaborators(any(Room.class))).thenReturn(Arrays.asList("user1@example.com"));
        when(roomService.getViewers(any(Room.class))).thenReturn(Arrays.asList("viewer@example.com"));

        ResponseEntity<Map<String, List<Object>>> response = roomController.getRoomDetails("roomId123");

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("collaborators"));
    }

    @Test
    void getRoomDetails_failure() {
        when(roomService.getRoomById(anyString())).thenReturn(Optional.empty());

        ResponseEntity<Map<String, List<Object>>> response = roomController.getRoomDetails("roomId123");

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void renameRoom_success() {
        RoomDTO roomDTO = new RoomDTO("roomId123", "New Room Name");
        when(roomService.getRoomById(anyString())).thenReturn(Optional.of(new Room()));
        doNothing().when(roomService).rename(any(Room.class));

        ResponseEntity<String> response = roomController.renameRoom(roomDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Room renamed successfully!", response.getBody());
    }
}