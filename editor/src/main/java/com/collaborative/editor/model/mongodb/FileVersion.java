package com.collaborative.editor.model.mongodb;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.Update;


@Document(collection = "file_versions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndex(def = "{'filename': 1, 'projectName': 1, 'roomId': 1}", unique = true)  // Compound unique index
public class FileVersion {

    private String filename;

    private Long roomId;

    private String projectName;

    private String content;
}