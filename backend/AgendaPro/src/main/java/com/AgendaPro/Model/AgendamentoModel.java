package com.AgendaPro.Model;

import com.AgendaPro.Enums.StatusAgendamento;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "agendamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class AgendamentoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private UsuarioModel cliente;
    @ManyToOne
    @JoinColumn(name = "profissional_id")
    private UsuarioModel profissional;
    @ManyToOne
    @JoinColumn(name = "servico_id")
    private ServicoModel servico;
    private LocalDateTime inicio;
    private LocalDateTime fim;
    @Enumerated(EnumType.STRING)
    private StatusAgendamento status;
}