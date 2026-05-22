package com.agendapro.Service;

import com.agendapro.Model.Usuario;
import com.agendapro.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public Usuario cadastrar(Usuario usuario) {

        if (repository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        usuario.setSenha(
                passwordEncoder.encode(usuario.getSenha())
        );

        return repository.save(usuario);
    }

    public Usuario login(
            String email,
            String senha
    ) {

        Usuario usuario =
                repository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("Usuário não encontrado"));

        boolean senhaCorreta =
                passwordEncoder.matches(
                        senha,
                        usuario.getSenha()
                );

        if (!senhaCorreta) {
            throw new RuntimeException("Senha inválida");
        }

        return usuario;
    }
}