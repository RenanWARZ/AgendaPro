package com.agendapro.Controller;

import com.agendapro.Model.Agendamento;
import com.agendapro.Service.AgendamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@RequiredArgsConstructor
@CrossOrigin("*")

public class AgendamentoController {

    private final AgendamentoService service;

    @PostMapping
    public ResponseEntity<Agendamento> criar(
            @RequestBody Agendamento agendamento
    ) {
        return ResponseEntity.ok(
                service.criar(agendamento)
        );
    }

    @PutMapping("/cancelar/{id}")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id
    ) {
        service.cancelar(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Agendamento>> listar() {
        return ResponseEntity.ok(
                service.listar()
        );
    }
}