package com.agendapro.Controller;

import com.agendapro.DTO.HorarioDTO;
import com.agendapro.Model.Agendamento;
import com.agendapro.Service.AgendamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Agendamento>> listar(@PathVariable Long id) {

        return ResponseEntity.ok(service.listar(id));
    }

        @GetMapping("/horarios")
        public ResponseEntity<List<HorarioDTO>> listarHorarios(
                @RequestParam Long servicoId,
                @RequestParam String data
        ) {

            return ResponseEntity.ok(

                    service.listarHorarios(
                            servicoId,
                            LocalDate.parse(data)
                    )

            );
        }
    }