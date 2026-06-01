package com.agendapro.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagamentoRequestDTO {

    private Long agendamentoId;
    private Double valor;
    private String metodo;
    private String cardToken;
    private Integer installments;
    private String issuerId;
    private String pagadorEmail;
    private String pagadorDocumento;
    private String pagadorNome;
}
