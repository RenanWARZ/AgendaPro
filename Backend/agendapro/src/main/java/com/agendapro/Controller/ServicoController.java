package com.agendapro.Controller;

import com.agendapro.Model.Servico;
import com.agendapro.Service.ServicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
@RequiredArgsConstructor
@CrossOrigin("*")

public class ServicoController {

    private final ServicoService service;

    @PostMapping
    public ResponseEntity<Servico> salvar(
            @RequestBody Servico servico
    ) {
        return ResponseEntity.ok(
                service.salvar(servico)
        );
    }

    @GetMapping
    public ResponseEntity<List<Servico>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/profissional/{id}")
    public ResponseEntity<List<Servico>> listar(@PathVariable Long id) {
        return ResponseEntity.ok(service.listarTodos());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Servico> editar(@PathVariable Long id,@RequestBody Servico servico) {

        return ResponseEntity.ok(service.editar(id, servico));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);

        return ResponseEntity.ok().build();
    }
}