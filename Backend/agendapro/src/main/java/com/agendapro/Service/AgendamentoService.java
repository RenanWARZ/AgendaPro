package com.agendapro.Service;

import com.agendapro.Enum.StatusAgendamento;
import com.agendapro.Model.Agendamento;
import com.agendapro.Model.Servico;
import com.agendapro.Model.Usuario;
import com.agendapro.Repository.AgendamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor

public class AgendamentoService {

    private final AgendamentoRepository repository;

    public Agendamento criar(Agendamento agendamento) {

        Servico servico = agendamento.getServico();

        LocalDateTime inicio = agendamento.getInicio();

        LocalDateTime fim =
                inicio.plusMinutes(servico.getDuracaoMinutos());

        Usuario profissional = agendamento.getProfissional();

        boolean conflito =
                repository
                        .existsByProfissionalAndInicioLessThanAndFimGreaterThan(
                                profissional,
                                fim,
                                inicio
                        );

        if (conflito) {
            throw new RuntimeException("Horário indisponível");
        }

        agendamento.setFim(fim);

        agendamento.setStatus(
                StatusAgendamento.AGENDADO
        );

        return repository.save(agendamento);
    }

    public void cancelar(Long id) {

        Agendamento agendamento =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Agendamento não encontrado"));

        agendamento.setStatus(
                StatusAgendamento.CANCELADO
        );

        repository.save(agendamento);
    }

    public List<Agendamento> listar() {
        return repository.findAll();
    }
}