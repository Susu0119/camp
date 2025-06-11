package com.m4gi.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class NotificationController {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable String userId) {
        SseEmitter emitter = new SseEmitter(600_000L);
        emitters.put(userId, emitter);

        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("연결 성공!"));
        } catch (Exception e) {
            emitters.remove(userId);
            emitter.complete();
        }

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));

        return emitter;
    }

    @PostMapping("/alert/{userId}")
    public String sendAlert(@PathVariable String userId, @RequestBody(required = false) String message) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("alert")
                        .data(message));
                return "알림 전송 성공";
            } catch (Exception e) {
                emitters.remove(userId);
                return "알림 전송 실패";
            }
        }
        return "사용자가 연결되어 있지 않습니다.";
    }

    @GetMapping("/alert/connected-users")
    public java.util.Set<String> getConnectedUsers() {
        return emitters.keySet();
    }
}