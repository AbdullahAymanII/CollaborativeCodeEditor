//package com.collaborative.editor.model.mysql.file;
//
//import com.collaborative.editor.model.mysql.project.Project;
//import com.collaborative.editor.model.mysql.room.Room;
//import jakarta.persistence.*;
//import lombok.Data;
//import lombok.Getter;
//import lombok.Setter;
//import org.springframework.data.annotation.Id;
//
//@Getter
//@Setter
//@Entity
//@Table(name = "files")
//@Data
//public class File {
//
//    @jakarta.persistence.Id
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(nullable = false)
//    private Long version;
//
//    @ManyToOne
//    @JoinColumn(name = "project_id", nullable = false)
//    private Project project;
//
//    @ManyToOne
//    @JoinColumn(name = "room_id", nullable = false)
//    private Room room;
//
//}