package com.agendapro.Repository;

import com.agendapro.Model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    List<Servico> findByProfissionalId(Long profissionalId);
}