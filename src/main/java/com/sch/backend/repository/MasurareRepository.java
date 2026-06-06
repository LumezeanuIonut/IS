package com.sch.backend.repository;

import com.sch.backend.entity.Masurare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasurareRepository extends JpaRepository<Masurare, Long> {

    List<Masurare> findByPacient_IdPacientOrderByTimestampMasurareDesc(Integer idPacient);

    List<Masurare> findBySenzor_IdSenzorOrderByTimestampMasurareDesc(Integer idSenzor);
}
