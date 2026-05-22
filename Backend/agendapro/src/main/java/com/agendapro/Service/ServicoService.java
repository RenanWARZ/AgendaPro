package com.agendapro.Service;

import com.agendapro.Model.Servico;
import com.agendapro.Repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class ServicoService {

    private final ServicoRepository repository;

    public Servico salvar(Servico servico) {
        return repository.save(servico);
    }

    public List<Servico> listar() {
        return repository.findAll();
    }
}