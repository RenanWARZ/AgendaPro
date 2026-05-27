package com.agendapro.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HorarioDTO {

    private String hora;
    private Boolean disponivel;
}