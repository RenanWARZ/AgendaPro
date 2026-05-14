package com.AgendaPro.Service;
import com.AgendaPro.Model.UsuarioModel;
import com.AgendaPro.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioModel cadastrar(UsuarioModel usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado");
        }
        if (usuario.getSenha().length() < 6) {
            throw new RuntimeException("Senha deve possuir no mínimo 6 caracteres");
        }
        return usuarioRepository.save(usuario);
    }
}