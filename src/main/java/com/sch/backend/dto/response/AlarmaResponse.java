package com.sch.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmaResponse {

    private Long idAlarma;
    private Integer idPacient;
    private Integer idSenzor;
    private String tipAlarma;
    private String mesaj;
    private LocalDateTime timestampDeclansare;
    private Boolean rezolvata;
}
