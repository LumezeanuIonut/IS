package com.sch.backend.controller;

import com.sch.backend.dto.response.AlarmaResponse;
import com.sch.backend.service.AlarmaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alarme")
@RequiredArgsConstructor
public class AlarmaController {

    private final AlarmaService alarmaService;

    /**
     * GET /api/alarme/nerezolvate
     * Toate alarmele active (rezolvata = 0), ordonate descrescător.
     */
    @GetMapping("/nerezolvate")
    @PreAuthorize("hasAnyRole('medic', 'supraveghetor', 'admin')")
    public ResponseEntity<List<AlarmaResponse>> getAlarmeNerezolvate() {
        return ResponseEntity.ok(alarmaService.getAlarmeNerezolvate());
    }

    /**
     * GET /api/alarme/pacient/{idPacient}
     * Toate alarmele (inclusiv rezolvate) ale unui pacient.
     */
    @GetMapping("/pacient/{idPacient}")
    @PreAuthorize("hasAnyRole('medic', 'supraveghetor', 'admin', 'ingrijitor')")
    public ResponseEntity<List<AlarmaResponse>> getAlarmeByPacient(
            @PathVariable Integer idPacient) {
        return ResponseEntity.ok(alarmaService.getAlarmeByPacient(idPacient));
    }

    /**
     * PUT /api/alarme/{idAlarma}/rezolva
     * Marchează alarma ca rezolvată (BIT 0 → 1).
     */
    @PutMapping("/{idAlarma}/rezolva")
    @PreAuthorize("hasAnyRole('medic', 'supraveghetor', 'admin')")
    public ResponseEntity<AlarmaResponse> rezolvaAlarma(@PathVariable Long idAlarma) {
        return ResponseEntity.ok(alarmaService.rezolvaAlarma(idAlarma));
    }
}
