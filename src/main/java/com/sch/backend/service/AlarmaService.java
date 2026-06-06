package com.sch.backend.service;

import com.sch.backend.dto.response.AlarmaResponse;
import com.sch.backend.entity.Alarma;
import com.sch.backend.repository.AlarmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlarmaService {

    private final AlarmaRepository alarmaRepository;

    /**
     * Marchează alarma ca rezolvată (BIT 0 → 1).
     */
    @Transactional
    public AlarmaResponse rezolvaAlarma(Long idAlarma) {
        Alarma alarma = alarmaRepository.findById(idAlarma)
                .orElseThrow(() -> new RuntimeException(
                        "Alarma cu id=" + idAlarma + " nu există"));

        if (alarma.getRezolvata()) {
            throw new IllegalStateException("Alarma este deja marcată ca rezolvată");
        }

        alarma.setRezolvata(true);
        return toResponse(alarmaRepository.save(alarma));
    }

    /** Returnează toate alarmele nerezolvate, ordonate cronologic descrescător. */
    @Transactional(readOnly = true)
    public List<AlarmaResponse> getAlarmeNerezolvate() {
        return alarmaRepository.findByRezolvataFalseOrderByTimestampDeclansareDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Returnează toate alarmele unui pacient, indiferent de stare. */
    @Transactional(readOnly = true)
    public List<AlarmaResponse> getAlarmeByPacient(Integer idPacient) {
        return alarmaRepository
                .findByPacient_IdPacientOrderByTimestampDeclansareDesc(idPacient)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AlarmaResponse toResponse(Alarma a) {
        return AlarmaResponse.builder()
                .idAlarma(a.getIdAlarma())
                .idPacient(a.getPacient() != null ? a.getPacient().getIdPacient() : null)
                .idSenzor(a.getSenzor() != null ? a.getSenzor().getIdSenzor() : null)
                .tipAlarma(a.getTipAlarma())
                .mesaj(a.getMesaj())
                .timestampDeclansare(a.getTimestampDeclansare())
                .rezolvata(a.getRezolvata())
                .build();
    }
}
