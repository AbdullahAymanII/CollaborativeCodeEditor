package com.collaborative.editor.database.dto.room;

import lombok.*;
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddMemberRequest {
    private String roomId;
    private String memberEmail;
    private String role;
}

