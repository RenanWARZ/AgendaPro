package com.agendapro.Controller;

import com.agendapro.DTO.PagamentoRequestDTO;
import com.agendapro.DTO.PagamentoResponseDTO;
import com.agendapro.Service.PagamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/pagamentos")
@RequiredArgsConstructor
@CrossOrigin("*")

public class PagamentoController {

    private final PagamentoService service;

    @PostMapping
    public ResponseEntity<PagamentoResponseDTO> iniciar(@RequestBody PagamentoRequestDTO dto) {
        return ResponseEntity.ok(service.iniciar(dto));
    }

    @GetMapping("/status/{agendamentoId}")
    public ResponseEntity<PagamentoResponseDTO> consultarStatus(@PathVariable Long agendamentoId) {
        return ResponseEntity.ok(service.consultarStatus(agendamentoId));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestBody Map<String, Object> payload) {
        if ("payment".equals(payload.get("type"))) {
            Map<?, ?> data = (Map<?, ?>) payload.get("data");
            if (data != null && data.get("id") != null) {
                service.processarWebhook(data.get("id").toString());
            }
        }
        return ResponseEntity.ok().build();
    }
}
