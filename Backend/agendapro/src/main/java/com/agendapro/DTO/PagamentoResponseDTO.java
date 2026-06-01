package com.agendapro.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagamentoResponseDTO {

    private Long id;
    private String status;
    private String metodo;
    private Double valor;
    private String externalId;
    private String pixQrCode;
    private String pixQrCodeTexto;
}
