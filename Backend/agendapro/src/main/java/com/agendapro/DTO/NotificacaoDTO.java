package com.agendapro.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificacaoDTO {

    private String tipo;
    private String mensagem;
    private Long usuarioId;
    private Long agendamentoId;
}