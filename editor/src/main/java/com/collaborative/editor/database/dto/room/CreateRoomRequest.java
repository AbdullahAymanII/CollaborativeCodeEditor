package com.collaborative.editor.database.dto.room;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoomRequest {
    private String memberEmail;
    private String roomName;
}
