package com.agendapro.Controller;

import com.agendapro.Model.Usuario;
import com.agendapro.Service.TokenService;
import com.agendapro.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {

        String email = dados.get("email");
        String senha = dados.get("senha");

        Usuario usuario = usuarioService.login(email, senha);

        String token = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "role", usuario.getRole().name()
        ));
    }
}