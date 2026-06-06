package com.sch.backend.dto.request;

import com.sch.backend.entity.Rol;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Numele este obligatoriu")
    @Size(max = 100)
    private String nume;

    @NotBlank(message = "Prenumele este obligatoriu")
    @Size(max = 100)
    private String prenume;

    @NotBlank(message = "Email-ul este obligatoriu")
    @Email(message = "Format email invalid")
    @Size(max = 150)
    private String email;

    @Size(max = 20)
    private String telefon;

    @NotBlank(message = "Parola este obligatorie")
    @Size(min = 8, message = "Parola trebuie să aibă cel puțin 8 caractere")
    private String parola;

    @NotNull(message = "Rolul este obligatoriu")
    private Rol rol;
}
