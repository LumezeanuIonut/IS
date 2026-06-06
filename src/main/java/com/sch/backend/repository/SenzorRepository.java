package com.sch.backend.repository;

import com.sch.backend.entity.Senzor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SenzorRepository extends JpaRepository<Senzor, Integer> {

    List<Senzor> findByDispozitiv_IdDispozitiv(Integer idDispozitiv);
}
