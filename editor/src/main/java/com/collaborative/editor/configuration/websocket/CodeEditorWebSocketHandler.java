//package com.collaborative.editor.configuration.websocket;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.web.socket.CloseStatus;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.util.Collections;
//import java.util.HashSet;
//import java.util.Map;
//import java.util.Set;
//
//public class CodeEditorWebSocketHandler extends TextWebSocketHandler {
//    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
//
//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
//        // Add new session when a client connects
//        sessions.add(session);
//    }
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String payload = message.getPayload();
//        ObjectMapper mapper = new ObjectMapper();
//        Map<String, Object> msgMap = mapper.readValue(payload, Map.class);
//
//        // Extract information from the JSON message
//        String content = (String) msgMap.get("content");
//        String user = (String) msgMap.get("user");
//        String type = (String) msgMap.get("type");
//
//        // Broadcast to all sessions
//        for (WebSocketSession webSocketSession : sessions) {
//            if (webSocketSession.isOpen()) {
//                webSocketSession.sendMessage(new TextMessage("User " + user + " edited: " + content));
//            }
//        }
//    }
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        // Remove session when a client disconnects
//        sessions.remove(session);
//    }
//}
