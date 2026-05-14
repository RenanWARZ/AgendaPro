package com.AgendaPro.Controller;
import com.AgendaPro.Model.ServicoModel;
import com.AgendaPro.Service.ServicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/servicos")
@RequiredArgsConstructor
@CrossOrigin("*")

public class ServicoController {
    private final ServicoService servicoService;

    @PostMapping
    public ResponseEntity<ServicoModel> salvar(
            @RequestBody ServicoModel servico
    ) {
        return ResponseEntity.ok(servicoService.salvar(servico));
    }
    @GetMapping
    public ResponseEntity<List<ServicoModel>> listar() {
        return ResponseEntity.ok(servicoService.listar());
    }
}