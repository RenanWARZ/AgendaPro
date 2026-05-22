package com.agendapro.Repository;

import com.agendapro.Model.Agendamento;
import com.agendapro.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    boolean existsByProfissionalAndInicioLessThanAndFimGreaterThan(
            Usuario profissional,
            LocalDateTime fim,
            LocalDateTime inicio
    );
}