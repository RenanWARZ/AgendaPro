package com.AgendaPro.Repository;

import com.AgendaPro.Model.AgendamentoModel;
import com.AgendaPro.Model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;

public interface AgendamentoRepository extends JpaRepository<AgendamentoModel, Long> {

    boolean existsByProfissionalAndInicioLessThanAndFimGreaterThan(
            UsuarioModel profissional,
            LocalDateTime fim,
            LocalDateTime inicio
    );
}