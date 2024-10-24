package com.collaborative.editor.exception;

import com.collaborative.editor.exception.authenticaionException.InvalidCredentialsException;
import com.collaborative.editor.exception.userException.UserNotFoundException;
import com.collaborative.editor.exception.versionControlException.fileException.FileNotFoundException;
import com.collaborative.editor.exception.roomException.*;
import com.collaborative.editor.exception.versionControlException.projectException.ProjectNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.FileAlreadyExistsException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleUserNotFoundException(UserNotFoundException ex) {
        logger.warn("User not found: {}", ex.getMessage(), ex);
        return createErrorResponse("User Not Found", ex.getMessage(), "USER_NOT_FOUND");
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, String> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        logger.warn("Invalid credentials attempt: {}", ex.getMessage(), ex);
        return createErrorResponse("Invalid Credentials", ex.getMessage(), "INVALID_CREDENTIALS");
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleProjectNotFoundException(ProjectNotFoundException ex) {
        logger.error("Project not found: {}", ex.getMessage(), ex);
        return createErrorResponse("Project Not Found", ex.getMessage(), "PROJECT_NOT_FOUND");
    }

    @ExceptionHandler(FileNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleFileNotFoundException(FileNotFoundException ex) {
        logger.error("File not found: {}", ex.getMessage(), ex);
        return createErrorResponse("File Not Found", ex.getMessage(), "FILE_NOT_FOUND");
    }

    @ExceptionHandler(FileAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleFileAlreadyExistsException(FileAlreadyExistsException ex) {
        logger.warn("File already exists: {}", ex.getMessage(), ex);
        return createErrorResponse("File Already Exists", ex.getMessage(), "FILE_ALREADY_EXISTS");
    }

    @ExceptionHandler(RoomNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleRoomNotFoundException(RoomNotFoundException ex) {
        logger.error("Room not found: {}", ex.getMessage(), ex);
        return createErrorResponse("Room Not Found", ex.getMessage(), "ROOM_NOT_FOUND");
    }

    @ExceptionHandler(RoomUpdateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleRoomUpdateException(RoomUpdateException ex) {
        logger.warn("Room update failed: {}", ex.getMessage(), ex);
        return createErrorResponse("Room Update Failed", ex.getMessage(), "ROOM_UPDATE_FAILED");
    }

    @ExceptionHandler(RoomCreationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleRoomCreationException(RoomCreationException ex) {
        logger.error("Room creation failed: {}", ex.getMessage(), ex);
        return createErrorResponse("Room Creation Failed", ex.getMessage(), "ROOM_CREATION_FAILED");
    }

    @ExceptionHandler(RoomDeletionException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleRoomDeletionException(RoomDeletionException ex) {
        logger.warn("Room deletion failed: {}", ex.getMessage(), ex);
        return createErrorResponse("Room Deletion Failed", ex.getMessage(), "ROOM_DELETION_FAILED");
    }

    @ExceptionHandler(RoomMembershipNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleRoomMembershipNotFoundException(RoomMembershipNotFoundException ex) {
        logger.warn("Room membership not found: {}", ex.getMessage(), ex);
        return createErrorResponse("Room Membership Not Found", ex.getMessage(), "ROOM_MEMBERSHIP_NOT_FOUND");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleGeneralException(Exception ex) {
        logger.error("An internal server error occurred: {}", ex.getMessage(), ex);

        return createErrorResponse(
                "Internal Server Error",
                "An unexpected error occurred." + " Please try again later.",
                "INTERNAL_SERVER_ERROR"
        );
    }

    private Map<String, String> createErrorResponse(String error, String message, String code) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        errorResponse.put("code", code);
        return errorResponse;
    }
}
