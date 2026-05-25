package com.agendapro.Service;

import com.agendapro.Model.Pagamento;
import com.agendapro.Repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class PagamentoService {

    private final PagamentoRepository repository;

    public Pagamento confirmar(Pagamento pagamento) {

        pagamento.setStatus("PAGO");

        return repository.save(pagamento);
    }
}