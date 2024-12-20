package com.collaborative.editor.model.file;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "file_versions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@CompoundIndex(def = "{'filename': 1, 'projectName': 1, 'roomId': 1}", unique = true)
public class File {

    private String filename;

    private String roomId;

    private String projectName;

    private String content;

    private Long createdAt;

    private Long lastModifiedAt;

    private String extension;

}