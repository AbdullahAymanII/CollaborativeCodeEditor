package com.collaborative.editor.model.project;

//import com.collaborative.editor.model.mysql.file.File;
import com.collaborative.editor.model.room.Room;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "projects", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "room_id"})
})
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}

