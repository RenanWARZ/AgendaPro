package com.agendapro.Service;

import com.agendapro.DTO.HorarioDTO;
import com.agendapro.Enum.StatusAgendamento;
import com.agendapro.Model.Agendamento;
import com.agendapro.Model.Servico;
import com.agendapro.Model.Usuario;
import com.agendapro.Repository.AgendamentoRepository;
import com.agendapro.Repository.ServicoRepository;
import com.agendapro.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class AgendamentoService {

    private final AgendamentoRepository repository;
    private final ServicoRepository servicoRepository;
    private final UsuarioRepository usuarioRepository;

    public Agendamento criar(Agendamento agendamento) {

        Servico servico = servicoRepository.findById(agendamento.getServico().getId())
                .orElseThrow(()->new RuntimeException("Serviço não encontrado"));

        LocalDateTime inicio = agendamento.getInicio();
        LocalDateTime fim = inicio.plusMinutes(servico.getDuracaoMinutos());

        boolean conflito = repository.existsByEmpresaAndInicioLessThanAndFimGreaterThan(agendamento.getEmpresa(),fim, inicio);

        if (conflito) {
            throw new RuntimeException("Horário indisponível");
        }

        agendamento.setServico(servico);
        agendamento.setFim(fim);
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        return repository.save(
                agendamento
        );
    }

    public void cancelar(Long id) {

        Agendamento agendamento =repository.findById(id)
                .orElseThrow(()->new RuntimeException("Agendamento não encontrado"));

        agendamento.setStatus(StatusAgendamento.CANCELADO);

        repository.save(agendamento);
    }

    public List<Agendamento> listar(Long id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuario.getRole().name().equals("ADMIN")){

            return repository.findByEmpresaId(id);
        }

        return repository.findByClienteId(id);
    }


    public List<HorarioDTO> listarHorarios(Long servicoId, LocalDate data) {

        Servico servico = servicoRepository.findById(servicoId).orElseThrow();

        DayOfWeek diaSemana = data.getDayOfWeek();

        String dia = diaSemana.name();

        if (!servico.getDiasFuncionamento().contains(dia)) {
            return new ArrayList<>();
        }

        LocalTime inicio = LocalTime.parse(servico.getHoraInicio());
        LocalTime fim = LocalTime.parse(servico.getHoraFim());

        int intervalo = servico.getIntervaloMinutos();

        List<Agendamento> agendamentos =

                repository
                        .findByServicoProfissionalIdAndInicioBetween(

                                servico.getProfissional().getId(),

                                data.atStartOfDay(),

                                data.atTime(23, 59)

                        );

        List<HorarioDTO> horarios =new ArrayList<>();

        while (!inicio.isAfter(fim)) {

            LocalTime horarioAtual = inicio;

            boolean ocupado = agendamentos.stream().anyMatch(
                    a -> a.getInicio()
                            .toLocalTime()
                            .equals(horarioAtual)
            );

            horarios.add(
                    new HorarioDTO(
                            horarioAtual.toString(),
                            !ocupado
                    )
            );

            inicio = inicio.plusMinutes(intervalo);
        }

        return horarios;
    }

    public Agendamento editar(Long id, LocalDateTime novoInicio) {

        Agendamento agendamento = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO){
            throw new RuntimeException("Não é possível editar um agendamento cancelado");
        }

        Servico servico = agendamento.getServico();
        LocalDateTime novoFim = novoInicio.plusMinutes(servico.getDuracaoMinutos());

        boolean conflito = repository.existsByEmpresaAndInicioLessThanAndFimGreaterThan(
                agendamento.getEmpresa(), novoFim, novoInicio
        );

        if (conflito) {
            throw new RuntimeException("Horário indisponível");
        }

        agendamento.setInicio(novoInicio);
        agendamento.setFim(novoFim);

        return repository.save(agendamento);
    }

    public List<Agendamento> listarPorServico(Long servicoId) {
        return repository.findByServicoId(servicoId);
    }
}