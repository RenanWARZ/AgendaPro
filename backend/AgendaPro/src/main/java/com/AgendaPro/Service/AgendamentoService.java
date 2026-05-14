package com.AgendaPro.Service;
import com.AgendaPro.Model.AgendamentoModel;
import com.AgendaPro.Model.ServicoModel;
import com.AgendaPro.Model.UsuarioModel;
import com.AgendaPro.Repository.AgendamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class AgendamentoService {
    private final AgendamentoRepository agendamentoRepository;

    public AgendamentoModel criarAgendamento(AgendamentoModel agendamento) {
        ServicoModel servico = agendamento.getServico();
        LocalDateTime inicio = agendamento.getInicio();
        LocalDateTime fim = inicio.plusMinutes(servico.getDuracaoMinutos());
        UsuarioModel profissional = agendamento.getProfissional();
        boolean conflito =
                agendamentoRepository
                        .existsByProfissionalAndInicioLessThanAndFimGreaterThan(
                                profissional,
                                fim,
                                inicio
                        );
        if (conflito) {
            throw new RuntimeException("Horário indisponível");
        }
        agendamento.setFim(fim);
        return agendamentoRepository.save(agendamento);
    }
    public void cancelarAgendamento(AgendamentoModel agendamento) {
        Duration diferenca =
                Duration.between(LocalDateTime.now(),

                        agendamento.getInicio());
        if (diferenca.toHours() < 24) {
            throw new RuntimeException("Cancelamento fora do prazo");
        }
        agendamentoRepository.delete(agendamento);
    }
}