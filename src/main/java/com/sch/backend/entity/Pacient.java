package com.sch.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "pacienti")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pacient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pacient")
    private Integer idPacient;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_utilizator", unique = true)
    private Utilizator utilizator;

    @Column(name = "cnp", length = 13)
    private String cnp;

    @Column(name = "varsta")
    private Integer varsta;

    @Column(name = "adresa_strada", length = 200)
    private String adresaStrada;

    @Column(name = "adresa_oras", length = 100)
    private String adresaOras;

    @Column(name = "adresa_judet", length = 100)
    private String adresaJudet;

    @Column(name = "profesie", length = 100)
    private String profesie;

    @Column(name = "loc_munca", length = 100)
    private String locMunca;

    @JsonIgnore
    @OneToOne(mappedBy = "pacient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Dispozitiv dispozitiv;

    @JsonIgnore
    @OneToMany(mappedBy = "pacient", fetch = FetchType.LAZY)
    private List<Masurare> masuratori;

    @JsonIgnore
    @OneToMany(mappedBy = "pacient", fetch = FetchType.LAZY)
    private List<Alarma> alarme;
}
