package com.sch.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MasurareRequest {

    @NotNull(message = "ID-ul senzorului este obligatoriu")
    private Integer idSenzor;

    @NotNull(message = "ID-ul pacientului este obligatoriu")
    private Integer idPacient;

    @NotNull(message = "Valoarea măsurătorii este obligatorie")
    private Double valoare;
}
