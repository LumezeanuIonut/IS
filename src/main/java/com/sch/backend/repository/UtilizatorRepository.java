package com.sch.backend.repository;

import com.sch.backend.entity.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilizatorRepository extends JpaRepository<Utilizator, Integer> {

    Optional<Utilizator> findByEmail(String email);

    boolean existsByEmail(String email);
}
