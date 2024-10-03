package com.collaborative.editor.model.mysql.room;

import com.collaborative.editor.model.mysql.project.Project;
import com.collaborative.editor.model.mysql.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique=true)
    private Long roomId;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RoomMembership> roomMemberships = new HashSet<>();


    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private Set<Project> projects = new HashSet<>();

}
