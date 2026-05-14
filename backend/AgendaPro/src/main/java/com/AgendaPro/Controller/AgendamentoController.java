package com.AgendaPro.Controller;
import com.AgendaPro.Model.AgendamentoModel;
import com.AgendaPro.Service.AgendamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/agendamentos")
@RequiredArgsConstructor
@CrossOrigin("*")

public class AgendamentoController {
    private final AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<AgendamentoModel> criar(
            @RequestBody AgendamentoModel agendamento
    ) {
        return ResponseEntity.ok(
                agendamentoService.criarAgendamento(agendamento)
        );
    }
}