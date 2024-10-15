package com.collaborative.editor.repository.mysql;

import com.collaborative.editor.model.project.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT r FROM Project r JOIN r.room v WHERE v.roomId = :roomId")
    Optional<List<Project>> findByRoomId(@Param("roomId") String roomId);

    @Query("SELECT r FROM Project r WHERE r.name = :projectName")
    Optional<Project> findByProjectName(@Param("projectName") String projectName);

    @Query("SELECT r FROM Project r JOIN r.room v WHERE v.roomId = :roomId AND r.name = :projectName")
    Optional<Project> findByRoomIdAndProjectName(@Param("roomId") String roomId, @Param("projectName") String projectName);

}
