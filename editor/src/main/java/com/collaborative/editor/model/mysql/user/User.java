package com.collaborative.editor.model.mysql.user;

import com.collaborative.editor.model.mysql.roomMembership.RoomMembership;
import com.collaborative.editor.model.mysql.user.constants.AccountSource;
import com.collaborative.editor.model.mysql.user.constants.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version // Optimistic locking
    private Long version;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "source")
    @Enumerated(EnumType.STRING)
    private AccountSource source;

//    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<Room> ownedRooms = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomMembership> roomMemberships = new ArrayList<>();
}
