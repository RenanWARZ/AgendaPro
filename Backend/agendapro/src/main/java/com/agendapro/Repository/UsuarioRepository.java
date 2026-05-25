package com.agendapro.Repository;

import com.agendapro.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByEmail(String email);
    boolean existsByDocumento(String documento);

    Optional<Usuario> findByEmail(String email);
}