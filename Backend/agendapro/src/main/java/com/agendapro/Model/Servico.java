package com.agendapro.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "servicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String nome;
    private String descricao;
    private String endereco;
    private Integer preco;
    private Integer duracaoMinutos;

    @Column(length = 800)
    private String foto;

    @ManyToOne
    @JoinColumn(name = "profissional_id")
    private Usuario profissional;
}