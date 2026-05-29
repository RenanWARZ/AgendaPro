package com.agendapro.Controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class NotificacaoController {

    @MessageMapping("/ping")
    @SendTo("/topic/pong")
    public String ping(String mensagem) {
        return "pong: " + mensagem;
    }
}