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
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.agendapro.DTO.NotificacaoDTO;

@Service
@RequiredArgsConstructor

public class AgendamentoService {

        private final AgendamentoRepository repository;
        private final ServicoRepository servicoRepository;
        private final UsuarioRepository usuarioRepository;
        private final SimpMessagingTemplate messagingTemplate;

        public Agendamento criar(Agendamento agendamento) {

                Servico servico = servicoRepository.findById(agendamento.getServico().getId())
                                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

                LocalDateTime inicio = agendamento.getInicio();
                LocalDateTime fim = inicio.plusMinutes(servico.getDuracaoMinutos());

                boolean conflito = repository.existsByEmpresaAndInicioLessThanAndFimGreaterThan(
                                agendamento.getEmpresa(), fim, inicio);

                if (conflito) {
                        throw new RuntimeException("Horário indisponível");
                }

                agendamento.setServico(servico);
                agendamento.setFim(fim);
                agendamento.setStatus(StatusAgendamento.AGENDADO);

                Agendamento salvo = repository.save(agendamento);

                NotificacaoDTO notificacao = new NotificacaoDTO(
                                "NOVO_AGENDAMENTO",
                                "Novo agendamento: " + salvo.getServico().getNome() +
                                                " com " + salvo.getCliente().getNome(),
                                salvo.getCliente().getId(),
                                salvo.getId());
                messagingTemplate.convertAndSend("/topic/agendamentos", notificacao);

                return salvo;
        }

        public void cancelar(Long id) {

                Agendamento agendamento = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

                agendamento.setStatus(StatusAgendamento.CANCELADO);

                repository.save(agendamento);

                NotificacaoDTO notificacao = new NotificacaoDTO(
                                "CANCELAMENTO",
                                "Seu agendamento de " + agendamento.getServico().getNome() + " foi cancelado.",
                                agendamento.getCliente().getId(),
                                agendamento.getId());
                messagingTemplate.convertAndSend(
                                "/topic/usuario/" + agendamento.getCliente().getId(),
                                notificacao);

        }

        public List<Agendamento> listar(Long id) {

                Usuario usuario = usuarioRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

                if (usuario.getRole().name().equals("ADMIN")) {
                        return repository.findByEmpresaId(id);
                }

                return repository.findByClienteId(id);
        }

        public List<HorarioDTO> listarHorarios(Long servicoId, LocalDate data) {

                Servico servico = servicoRepository.findById(servicoId).orElseThrow();

                // DayOfWeek diaSemana = data.getDayOfWeek();
                // String dia = diaSemana.name();
                // if (!servico.getDiasFuncionamento().contains(dia)) {
                // return new ArrayList<>();
                // }

                LocalTime inicio = LocalTime.parse(servico.getHoraInicio());
                LocalTime fim = LocalTime.parse(servico.getHoraFim());

                int intervalo = servico.getIntervaloMinutos();

                List<Agendamento> agendamentos =

                                repository.findByServicoProfissionalIdAndInicioBetween(
                                                servico.getProfissional().getId(),
                                                data.atStartOfDay(),
                                                data.atTime(23, 59));

                List<HorarioDTO> horarios = new ArrayList<>();

                while (!inicio.isAfter(fim)) {
                        LocalTime horarioAtual = inicio;

                        boolean ocupado = agendamentos.stream().anyMatch(
                                        a -> a.getInicio()
                                                        .toLocalTime()
                                                        .equals(horarioAtual));

                        horarios.add(
                                        new HorarioDTO(
                                                        horarioAtual.toString(),
                                                        !ocupado));

                        inicio = inicio.plusMinutes(intervalo);
                }

                return horarios;
        }

        public Agendamento editar(Long id, LocalDateTime novoInicio) {

                Agendamento agendamento = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

                if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
                        throw new RuntimeException("Não é possível editar um agendamento cancelado");
                }

                Servico servico = agendamento.getServico();
                LocalDateTime novoFim = novoInicio.plusMinutes(servico.getDuracaoMinutos());

                boolean conflito = repository.existsByEmpresaAndInicioLessThanAndFimGreaterThan(
                                agendamento.getEmpresa(), novoFim, novoInicio);

                if (conflito) {
                        throw new RuntimeException("Horário indisponível");
                }

                agendamento.setInicio(novoInicio);
                agendamento.setFim(novoFim);

                Agendamento salvo = repository.save(agendamento);

                NotificacaoDTO notificacao = new NotificacaoDTO(
                                "ATUALIZACAO",
                                "Seu agendamento de " + salvo.getServico().getNome() +
                                                " foi atualizado para " + novoInicio.toString(),
                                salvo.getCliente().getId(),
                                salvo.getId());
                messagingTemplate.convertAndSend(
                                "/topic/usuario/" + salvo.getCliente().getId(),
                                notificacao);

                return salvo;

        }

        public List<Agendamento> listarPorServico(Long servicoId) {
                return repository.findByServicoId(servicoId);
        }
}