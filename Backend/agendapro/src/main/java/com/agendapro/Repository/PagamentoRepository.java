package com.agendapro.Repository;

import com.agendapro.Model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {
    Optional<Pagamento> findByExternalId(String externalId);
    Optional<Pagamento> findByAgendamentoId(Long agendamentoId);
}
