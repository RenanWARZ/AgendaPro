package com.AgendaPro.Controller;
import com.AgendaPro.Model.UsuarioModel;
import com.AgendaPro.Service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin("*")

public class UsuarioController {
    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioModel> cadastrar(
            @RequestBody UsuarioModel usuario
    ) {
        return ResponseEntity.ok(usuarioService.cadastrar(usuario));
    }
}