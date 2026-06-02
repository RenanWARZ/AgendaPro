package com.agendapro.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreferenceResponseDTO {

    private String preferenceId;
    private String checkoutUrl;
    private String sandboxUrl;
}