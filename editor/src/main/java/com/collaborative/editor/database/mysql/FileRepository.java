//package com.collaborative.editor.database.mysql;
//
//import com.collaborative.editor.model.mysql.file.File;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface FileRepository extends JpaRepository<File, Long> {
//
//    @Query("SELECT r FROM File r JOIN r.room v WHERE v.roomId = :roomId")
//    Optional<List<File>> findByRoomId(@Param("roomId") Long roomId);
//
//    @Query("SELECT r FROM File r JOIN r.project v WHERE v.projectId = :projectId")
//    Optional<List<File>> findByProjectId(@Param("projectId") Long projectId);
//
//    @Query("SELECT r FROM File r WHERE r.project.projectId = :projectId AND r.room.roomId = :roomId")
//    Optional<List<File>> findByProjectIdAndRoomId(@Param("projectId") Long projectId, @Param("roomId") Long roomId);
//
//    @Query("SELECT r FROM File r WHERE r.name = :fileName")
//    Optional<List<File>> findByName(@Param("fileName") String fileName);
//
//}
