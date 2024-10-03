package com.collaborative.editor.model.mysql.room;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long roomId;
    private String name;
}
