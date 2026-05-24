package com.agendapro.Service;

import com.agendapro.Model.Agendamento;
import com.agendapro.Model.Servico;
import com.agendapro.Model.Usuario;
import com.agendapro.Repository.AgendamentoRepository;
import com.agendapro.Repository.ServicoRepository;
import com.agendapro.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
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
        agendamento.setStatus("AGENDADO");

        return repository.save(
                agendamento
        );
    }

    public void cancelar(Long id) {

        Agendamento agendamento =repository.findById(id)
                .orElseThrow(()->new RuntimeException("Agendamento não encontrado"));

        agendamento.setStatus("CANCELADO");

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
}