package com.sch.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "senzori")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Senzor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_senzor")
    private Integer idSenzor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dispozitiv", nullable = false)
    private Dispozitiv dispozitiv;

    @Column(name = "tip_senzor", length = 50)
    private String tipSenzor;

    @Column(name = "unitate_masura", length = 20)
    private String unitateMasura;

    @Column(name = "valoare_minima")
    private Double valoareMinima;

    @Column(name = "valoare_maxima")
    private Double valoareMaxima;

    @Column(name = "interval_esantionare")
    private Integer intervalEsantionare;

    @JsonIgnore
    @OneToMany(mappedBy = "senzor", fetch = FetchType.LAZY)
    private List<Masurare> masuratori;

    @JsonIgnore
    @OneToMany(mappedBy = "senzor", fetch = FetchType.LAZY)
    private List<Alarma> alarme;
}
