package com.sch.backend.repository;

import com.sch.backend.entity.Alarma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlarmaRepository extends JpaRepository<Alarma, Long> {

    List<Alarma> findByPacient_IdPacientOrderByTimestampDeclansareDesc(Integer idPacient);

    List<Alarma> findByRezolvataFalseOrderByTimestampDeclansareDesc();

    List<Alarma> findByPacient_IdPacientAndRezolvataFalse(Integer idPacient);
}
