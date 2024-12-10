package com.collaborative.editor.model.room;

import com.collaborative.editor.model.project.Project;
import com.collaborative.editor.model.roomMembership.RoomMembership;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(nullable = false, unique=true)
    private String roomId;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomMembership> roomMemberships = new ArrayList<>();


    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private Set<Project> projects = new HashSet<>();

}
