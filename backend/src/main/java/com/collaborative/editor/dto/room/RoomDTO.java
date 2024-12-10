package com.collaborative.editor.dto.room;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {
    private String roomId;
    private String name;
}
