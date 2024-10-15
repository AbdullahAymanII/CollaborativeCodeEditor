package com.collaborative.editor.service.roomService;

import com.collaborative.editor.database.mysql.RoomMembershipRepository;
import com.collaborative.editor.database.mysql.RoomRepository;
import com.collaborative.editor.model.mysql.room.Room;
import com.collaborative.editor.model.mysql.room.RoomRole;
import com.collaborative.editor.model.mysql.roomMembership.RoomMembership;
import com.collaborative.editor.model.mysql.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.locks.ReentrantLock;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RoomServiceImplTest {

    @InjectMocks
    private RoomServiceImpl roomService;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private RoomMembershipRepository roomMembershipRepository;

    @Mock
    private ReentrantLock lock;

    private User owner;
    private Room room;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        owner = new User();
        owner.setEmail("test@example.com");
        owner.setUsername("testUser");

        room = new Room();
        room.setRoomId(UUID.randomUUID().toString());
        room.setName("Test Room");
    }

    @Test
    void createRoom_success() {
        when(roomRepository.save(any(Room.class))).thenReturn(room);
        String roomId = roomService.createRoom(owner, "Test Room");

        assertNotNull(roomId);
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    void createRoom_failure() {
        when(roomRepository.save(any(Room.class))).thenThrow(RuntimeException.class);

        assertThrows(RuntimeException.class, () -> roomService.createRoom(owner, "Test Room"));
    }

    @Test
    void deleteRoom_success() {
        when(roomRepository.findByRoomId(anyString())).thenReturn(Optional.of(room));
        doNothing().when(roomRepository).deleteByRoomId(anyString());

        assertDoesNotThrow(() -> roomService.deleteRoom(room.getRoomId()));
        verify(roomRepository, times(1)).deleteByRoomId(anyString());
    }

    @Test
    void deleteRoom_roomNotFound() {
        when(roomRepository.findByRoomId(anyString())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> roomService.deleteRoom(room.getRoomId()));
    }

    @Test
    void removeUserFromRoom_success() {
        when(roomMembershipRepository.findByRole(room, owner, RoomRole.COLLABORATOR)).thenReturn(Optional.of(new RoomMembership()));
        doNothing().when(roomMembershipRepository).delete(any());

        assertDoesNotThrow(() -> roomService.removeUserFromRoom(room, owner, RoomRole.COLLABORATOR));
        verify(roomMembershipRepository, times(1)).delete(any());
    }


    @Test
    void renameRoom_success() {
        when(roomRepository.save(room)).thenReturn(room);
        roomService.rename(room);

        verify(roomRepository, times(1)).save(room);
    }
}
