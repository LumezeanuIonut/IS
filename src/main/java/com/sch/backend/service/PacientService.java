package com.sch.backend.service;

import com.sch.backend.dto.response.PacientResponse;
import com.sch.backend.entity.Pacient;
import com.sch.backend.entity.Utilizator;
import com.sch.backend.repository.PacientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PacientService {

    private final PacientRepository pacientRepository;

    @Transactional(readOnly = true)
    public List<PacientResponse> getAllPacienti() {
        return pacientRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PacientResponse getPacientById(Integer id) {
        return pacientRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Pacientul cu id=" + id + " nu a fost găsit"));
    }

    private PacientResponse toResponse(Pacient p) {
        Utilizator u = p.getUtilizator();
        return PacientResponse.builder()
                .idPacient(p.getIdPacient())
                .idUtilizator(u != null ? u.getIdUtilizator() : null)
                .numeComplet(u != null ? u.getPrenume() + " " + u.getNume() : null)
                .email(u != null ? u.getEmail() : null)
                .cnp(p.getCnp())
                .varsta(p.getVarsta())
                .adresaStrada(p.getAdresaStrada())
                .adresaOras(p.getAdresaOras())
                .adresaJudet(p.getAdresaJudet())
                .profesie(p.getProfesie())
                .locMunca(p.getLocMunca())
                .build();
    }
}
