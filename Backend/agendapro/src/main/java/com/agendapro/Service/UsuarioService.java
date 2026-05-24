package com.agendapro.Service;

import com.agendapro.Enum.Role;
import com.agendapro.Model.Usuario;
import com.agendapro.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor

public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public Usuario cadastrar(Usuario usuario) {

        usuario.setEmail(usuario.getEmail().toLowerCase());

        usuario.setDocumento(usuario.getDocumento()
                .replace(".", "")
                .replace("-", "")
                .replace("/", "")
        );

        if (repository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado");
        }

        if (repository.existsByDocumento(usuario.getDocumento())) {
            throw new RuntimeException("CPF/CNPJ já cadastrado");
        }

        if (usuario.getTipoPessoa().name().equals("CNPJ")) {
            usuario.setRole(Role.ADMIN);
        } else {
            usuario.setRole(Role.USUARIO);
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }

    public Usuario login(String email, String senha) {
        Usuario usuario = repository.findByEmail(email.toLowerCase())
                .orElseThrow(() ->new RuntimeException("Usuário não encontrado"));

        boolean senhaCorreta = passwordEncoder.matches( senha, usuario.getSenha());

        if (!senhaCorreta) {
            throw new RuntimeException("Senha inválida");
        }

        return usuario;
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }
}