package com.sch.backend.controller;

import com.sch.backend.dto.response.PacientResponse;
import com.sch.backend.service.PacientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacienti")
@RequiredArgsConstructor
public class PacientController {

    private final PacientService pacientService;

    /**
     * GET /api/pacienti
     * Lista tuturor pacienților.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('medic', 'supraveghetor', 'admin')")
    public ResponseEntity<List<PacientResponse>> getAllPacienti() {
        return ResponseEntity.ok(pacientService.getAllPacienti());
    }

    /**
     * GET /api/pacienti/{id}
     * Datele unui singur pacient.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('medic', 'supraveghetor', 'admin', 'ingrijitor')")
    public ResponseEntity<PacientResponse> getPacientById(@PathVariable Integer id) {
        return ResponseEntity.ok(pacientService.getPacientById(id));
    }
}
