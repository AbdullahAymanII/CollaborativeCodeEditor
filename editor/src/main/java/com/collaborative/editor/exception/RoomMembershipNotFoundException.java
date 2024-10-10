package com.collaborative.editor.exception;

public class RoomMembershipNotFoundException extends RuntimeException {
    public RoomMembershipNotFoundException(String message) {
        super(message);
    }
}
