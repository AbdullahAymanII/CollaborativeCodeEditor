package com.collaborative.editor.dto.room;

import lombok.*;
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddMemberRequest {
    private String roomId;
    private String memberEmail;
    private String role;
}

