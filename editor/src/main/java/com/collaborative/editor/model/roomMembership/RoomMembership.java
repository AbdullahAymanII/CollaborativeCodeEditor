package com.collaborative.editor.model.roomMembership;

import com.collaborative.editor.model.room.Room;
import com.collaborative.editor.model.room.RoomRole;
import com.collaborative.editor.model.user.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "room_memberships",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"room_id", "user_id", "role"})})
public class RoomMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private RoomRole role;

}
