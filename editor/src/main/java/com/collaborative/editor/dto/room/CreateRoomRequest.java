package com.collaborative.editor.dto.room;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRoomRequest {
    private String memberEmail;
    private String roomName;
}
