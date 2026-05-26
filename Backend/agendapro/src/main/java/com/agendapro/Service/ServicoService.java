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

    public Servico salvar(
            Servico servico
    ) {

        return repository.save(
                servico
        );
    }

    public List<Servico> listarTodos() {

        return repository.findAll();
    }

    public List<Servico> listar(Long profissionalId
    ) {

        return repository
                .findByProfissionalId(
                        profissionalId
                );
    }

    public Servico editar(
            Long id,
            Servico servico
    ) {

        Servico servicoExistente =
                repository.findById(id)

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Serviço não encontrado"
                                )
                        );

        servicoExistente.setFoto(
                servico.getFoto()
        );

        servicoExistente.setNome(
                servico.getNome()
        );

        servicoExistente.setDescricao(
                servico.getDescricao()
        );

        servicoExistente.setEndereco(
                servico.getEndereco()
        );

        servicoExistente.setPreco(
                servico.getPreco()
        );

        servicoExistente.setDuracaoMinutos(
                servico.getDuracaoMinutos()
        );

        return repository.save(
                servicoExistente
        );
    }

    public void excluir(Long id) {

        repository.deleteById(id);
    }
}