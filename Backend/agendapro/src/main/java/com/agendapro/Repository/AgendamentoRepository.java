package com.agendapro.Repository;

import com.agendapro.Model.Agendamento;
import com.agendapro.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    boolean existsByEmpresaAndInicioLessThanAndFimGreaterThan(
            Usuario empresa,
            LocalDateTime fim,
            LocalDateTime inicio
    );

    List<Agendamento> findByClienteId(Long clienteId);
    List<Agendamento> findByEmpresaId(Long empresaId);
    List<Agendamento> findByServicoProfissionalIdAndInicioBetween(
            Long profissionalId,
            LocalDateTime inicio,
            LocalDateTime fim
    );
}