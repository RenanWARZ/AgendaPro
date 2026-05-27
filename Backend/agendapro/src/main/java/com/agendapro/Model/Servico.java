package com.agendapro.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    private Double preco;
    private Integer duracaoMinutos;

    @Column(length = 800)
    private String foto;

    @ElementCollection
    private List<String> diasFuncionamento;

    private String horaInicio;
    private String horaFim;
    private Integer intervaloMinutos;

    @ManyToOne
    @JoinColumn(name = "profissional_id")
    private Usuario profissional;
}