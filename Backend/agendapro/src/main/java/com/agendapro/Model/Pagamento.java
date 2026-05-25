package com.agendapro.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pagamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valor;

    private String status;

    private String metodo;

    @OneToOne
    @JoinColumn(name = "agendamento_id")
    private Agendamento agendamento;
}