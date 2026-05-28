package com.agendapro.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.agendapro.Model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${jwt.secret}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        Algorithm algoritmo = Algorithm.HMAC256(secret);

        return JWT.create()
                .withIssuer("agendapro")
                .withSubject(usuario.getEmail())
                .withClaim("id", usuario.getId())
                .withClaim("role", usuario.getRole().name())
                .withExpiresAt(expiracaoToken())
                .sign(algoritmo);
    }

    public String validarToken(String token) {
        Algorithm algoritmo = Algorithm.HMAC256(secret);

        return JWT.require(algoritmo)
                .withIssuer("agendapro")
                .build()
                .verify(token)
                .getSubject(); // retorna o email do usuário
    }

    private Instant expiracaoToken() {
        return LocalDateTime.now()
                .plusHours(8)
                .toInstant(ZoneOffset.of("-03:00"));
    }
}