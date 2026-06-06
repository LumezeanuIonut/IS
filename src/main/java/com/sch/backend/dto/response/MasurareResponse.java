package com.sch.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MasurareResponse {

    private Long idMasurare;
    private Integer idSenzor;
    private Integer idPacient;
    private Double valoare;
    private LocalDateTime timestampMasurare;

    // Prezent doar dacă s-a generat o alarmă automat
    private AlarmaResponse alarmaGenerata;
}
