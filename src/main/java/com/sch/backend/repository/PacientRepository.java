package com.sch.backend.repository;

import com.sch.backend.entity.Pacient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PacientRepository extends JpaRepository<Pacient, Integer> {

    Optional<Pacient> findByUtilizator_IdUtilizator(Integer idUtilizator);
}
