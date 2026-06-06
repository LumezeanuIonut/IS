package com.sch.backend.service;

import com.sch.backend.dto.request.MasurareRequest;
import com.sch.backend.dto.response.AlarmaResponse;
import com.sch.backend.dto.response.MasurareResponse;
import com.sch.backend.entity.Alarma;
import com.sch.backend.entity.Masurare;
import com.sch.backend.entity.Pacient;
import com.sch.backend.entity.Senzor;
import com.sch.backend.repository.AlarmaRepository;
import com.sch.backend.repository.MasurareRepository;
import com.sch.backend.repository.PacientRepository;
import com.sch.backend.repository.SenzorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MasurareService {

    private final MasurareRepository masurareRepository;
    private final SenzorRepository senzorRepository;
    private final PacientRepository pacientRepository;
    private final AlarmaRepository alarmaRepository;

    /**
     * Salvează o măsurătoare și generează automat o alarmă dacă valoarea
     * depășește intervalul definit pe senzor.
     */
    @Transactional
    public MasurareResponse adaugaMasurare(MasurareRequest request) {
        Senzor senzor = senzorRepository.findById(request.getIdSenzor())
                .orElseThrow(() -> new RuntimeException(
                        "Senzorul cu id=" + request.getIdSenzor() + " nu există"));

        Pacient pacient = pacientRepository.findById(request.getIdPacient())
                .orElseThrow(() -> new RuntimeException(
                        "Pacientul cu id=" + request.getIdPacient() + " nu există"));

        Masurare masurare = Masurare.builder()
                .senzor(senzor)
                .pacient(pacient)
                .valoare(request.getValoare())
                .build();
        masurare = masurareRepository.save(masurare);

        Alarma alarma = genereazaAlarmaLaNevoie(masurare, senzor, pacient);

        return MasurareResponse.builder()
                .idMasurare(masurare.getIdMasurare())
                .idSenzor(senzor.getIdSenzor())
                .idPacient(pacient.getIdPacient())
                .valoare(masurare.getValoare())
                .timestampMasurare(masurare.getTimestampMasurare())
                .alarmaGenerata(alarma != null ? toAlarmaResponse(alarma) : null)
                .build();
    }

    @Transactional(readOnly = true)
    public List<MasurareResponse> getMasurariByPacient(Integer idPacient) {
        return masurareRepository
                .findByPacient_IdPacientOrderByTimestampMasurareDesc(idPacient)
                .stream()
                .map(m -> MasurareResponse.builder()
                        .idMasurare(m.getIdMasurare())
                        .idSenzor(m.getSenzor().getIdSenzor())
                        .idPacient(m.getPacient().getIdPacient())
                        .valoare(m.getValoare())
                        .timestampMasurare(m.getTimestampMasurare())
                        .build())
                .toList();
    }

    // ─── Logică generare alarmă ───────────────────────────────────────────────

    private Alarma genereazaAlarmaLaNevoie(Masurare masurare, Senzor senzor, Pacient pacient) {
        Double min = senzor.getValoareMinima();
        Double max = senzor.getValoareMaxima();

        // Nu avem interval definit pe senzor → nicio alarmă
        if (min == null || max == null) return null;

        double valoare = masurare.getValoare();

        // Valoarea este în interval normal → nicio alarmă
        if (valoare >= min && valoare <= max) return null;

        // Pragul de 20% din intervalul normal decide tipul alarmei
        double marja = (max - min) * 0.20;
        String tip = (valoare < (min - marja) || valoare > (max + marja))
                ? "critica"
                : "avertizare";

        String mesaj = String.format(
                "[%s] Senzor '%s' – valoare: %.2f %s (interval normal: %.2f – %.2f %s)",
                tip.toUpperCase(),
                senzor.getTipSenzor(),
                valoare,
                senzor.getUnitateMasura(),
                min, max,
                senzor.getUnitateMasura());

        Alarma alarma = Alarma.builder()
                .pacient(pacient)
                .senzor(senzor)
                .tipAlarma(tip)
                .mesaj(mesaj)
                .rezolvata(false)
                .build();

        return alarmaRepository.save(alarma);
    }

    private AlarmaResponse toAlarmaResponse(Alarma a) {
        return AlarmaResponse.builder()
                .idAlarma(a.getIdAlarma())
                .idPacient(a.getPacient().getIdPacient())
                .idSenzor(a.getSenzor().getIdSenzor())
                .tipAlarma(a.getTipAlarma())
                .mesaj(a.getMesaj())
                .timestampDeclansare(a.getTimestampDeclansare())
                .rezolvata(a.getRezolvata())
                .build();
    }
}
