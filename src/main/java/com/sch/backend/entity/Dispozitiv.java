package com.sch.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "dispozitive")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dispozitiv {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_dispozitiv")
    private Integer idDispozitiv;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pacient", unique = true)
    private Pacient pacient;

    @Column(name = "tip_dispozitiv", length = 100)
    private String tipDispozitiv;

    @Column(name = "data_activare")
    private LocalDateTime dataActivare;

    @JsonIgnore
    @OneToMany(mappedBy = "dispozitiv", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Senzor> senzori;
}
