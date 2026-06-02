package com.agendapro.Controller;

import com.agendapro.DTO.PreferenceRequestDTO;
import com.agendapro.DTO.PreferenceResponseDTO;
import com.agendapro.Service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/checkout")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CheckoutController {

    private final CheckoutService service;

    @PostMapping("/criar-preferencia")
    public ResponseEntity<PreferenceResponseDTO> criarPreferencia(@RequestBody PreferenceRequestDTO dto) {
        return ResponseEntity.ok(service.criarPreferencia(dto));
    }


    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(@RequestBody Map<String, Object> payload) {
        String type = (String) payload.get("type");
        if ("payment".equals(type)) {
            Map<?, ?> data = (Map<?, ?>) payload.get("data");
            if (data != null && data.get("id") != null) {
                service.processarWebhook(data.get("id").toString());
            }
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{agendamentoId}")
    public ResponseEntity<Map<String, String>> consultarStatus(@PathVariable Long agendamentoId) {
        String status = service.consultarStatus(agendamentoId);
        return ResponseEntity.ok(Map.of("status", status));
    }
}