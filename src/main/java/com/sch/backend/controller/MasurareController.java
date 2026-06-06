package com.sch.backend.controller;

import com.sch.backend.dto.request.MasurareRequest;
import com.sch.backend.dto.response.MasurareResponse;
import com.sch.backend.service.MasurareService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/masurari")
@RequiredArgsConstructor
public class MasurareController {

    private final MasurareService masurareService;

    /**
     * POST /api/masurari
     * Salvează o nouă măsurătoare. Dacă valoarea depășește limitele senzorului,
     * se generează automat o alarmă (returnată în câmpul alarmaGenerata).
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('medic', 'ingrijitor', 'admin')")
    public ResponseEntity<MasurareResponse> adaugaMasurare(
            @Valid @RequestBody MasurareRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(masurareService.adaugaMasurare(request));
    }

    /**
     * GET /api/masurari/pacient/{idPacient}
     * Returnează istoricul măsurătorilor unui pacient, ordonate descrescător.
     */
    @GetMapping("/pacient/{idPacient}")
    @PreAuthorize("hasAnyRole('medic', 'supraveghetor', 'admin', 'ingrijitor')")
    public ResponseEntity<List<MasurareResponse>> getMasurariByPacient(
            @PathVariable Integer idPacient) {
        return ResponseEntity.ok(masurareService.getMasurariByPacient(idPacient));
    }
}
