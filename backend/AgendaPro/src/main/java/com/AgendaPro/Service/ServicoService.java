package com.AgendaPro.Service;
import com.AgendaPro.Model.ServicoModel;
import com.AgendaPro.Repository.ServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor

public class ServicoService {
    private final ServicoRepository servicoRepository;
    public ServicoModel salvar(ServicoModel servico) {
        if (servico.getDuracaoMinutos() <= 0) {
            throw new RuntimeException("Duração inválida");
        }
        return servicoRepository.save(servico);
    }
    public List<ServicoModel> listar() {
        return servicoRepository.findAll();
    }
}