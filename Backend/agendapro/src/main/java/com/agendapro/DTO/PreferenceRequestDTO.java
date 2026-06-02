package com.agendapro.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceRequestDTO {

    private Long agendamentoId;
    private Double valor;
    private String nomeServico;
    private String pagadorEmail;
    private String pagadorNome;
}