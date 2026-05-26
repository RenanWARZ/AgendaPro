package com.agendapro.Model;

import com.agendapro.Enum.Role;
import com.agendapro.Enum.TipoPessoa;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true,nullable = false)
    private String email;

    private String senha;

    @Column(unique = true, nullable = false)
    private String documento;

    @Enumerated(EnumType.STRING)
    private TipoPessoa tipoPessoa;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Usuario empresa;
}