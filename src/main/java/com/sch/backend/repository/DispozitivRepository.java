package com.sch.backend.repository;

import com.sch.backend.entity.Dispozitiv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DispozitivRepository extends JpaRepository<Dispozitiv, Integer> {

    Optional<Dispozitiv> findByPacient_IdPacient(Integer idPacient);
}
