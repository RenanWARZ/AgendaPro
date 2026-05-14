package com.AgendaPro.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "servicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder


public class ServicoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Double preco;
    private Integer duracaoMinutos;
    @ManyToOne
    @JoinColumn(name = "profissional_id")
    private UsuarioModel profissional;
}