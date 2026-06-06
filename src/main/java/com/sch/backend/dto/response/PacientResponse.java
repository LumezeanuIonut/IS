package com.sch.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacientResponse {

    private Integer idPacient;
    private Integer idUtilizator;
    private String numeComplet;
    private String email;
    private String cnp;
    private Integer varsta;
    private String adresaStrada;
    private String adresaOras;
    private String adresaJudet;
    private String profesie;
    private String locMunca;
}
