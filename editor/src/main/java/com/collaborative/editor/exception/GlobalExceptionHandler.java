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
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "User Not Found");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Invalid Credentials Exception");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleGeneralException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(FileAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleFileAlreadyExistsException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(FileNotFoundException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleFileNotFoundException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(ProjectNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleProjectNotFoundException(ProjectNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Project Not Found");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(RoomNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleRoomNotFoundException(RoomNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Room Not Found");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(RoomMembershipNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleRoomMembershipNotFoundException(RoomMembershipNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "RoomMembership Not Found Exception");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "ResourceNotFoundException Not Found Exception");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }


    @ExceptionHandler(RoomUpdateException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleRoomUpdateException(RoomUpdateException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "ResourceNotFoundException Not Found Exception");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(RoomCreationException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleRoomCreationException(RoomCreationException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "ResourceNotFoundException Not Found Exception");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

    @ExceptionHandler(RoomDeletionException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleRoomDeletionException(RoomDeletionException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "ResourceNotFoundException Not Found Exception");
        errorResponse.put("message", ex.getMessage());

        logger.error("Exception occurred:", ex.getMessage(), ex);

        return errorResponse;
    }

}
