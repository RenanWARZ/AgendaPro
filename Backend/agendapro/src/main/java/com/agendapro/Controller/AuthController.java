package com.agendapro.Controller;

import com.agendapro.Model.Usuario;
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

    private final UsuarioService service;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> dados
    ) {

        String email = dados.get("email");
        String senha = dados.get("senha");

        Usuario usuario =
                service.login(email, senha);

        return ResponseEntity.ok(usuario);
    }
}