package com.agendapro.Controller;

import com.agendapro.Model.Pagamento;
import com.agendapro.Service.PagamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pagamentos")
@RequiredArgsConstructor
@CrossOrigin("*")

public class PagamentoController {

    private final PagamentoService service;

    @PostMapping
    public ResponseEntity<Pagamento> confirmar(@RequestBody Pagamento pagamento) {

        return ResponseEntity.ok(service.confirmar(pagamento));
    }
}