package com.collaborative.editor.model.mongodb;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document(collection = "file_versions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndex(def = "{'filename': 1, 'projectName': 1, 'roomId': 1}", unique = true)  // Compound unique index
public class File {

    private String filename;

    private String roomId;

    private String projectName;

    private String content;

    private Long createdAt;

    private Long lastModifiedAt;

    private String extension;

}