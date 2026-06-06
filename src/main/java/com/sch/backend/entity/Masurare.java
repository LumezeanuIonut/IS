package com.sch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "masuratori")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Masurare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_masurare")
    private Long idMasurare;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_senzor", nullable = false)
    private Senzor senzor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pacient", nullable = false)
    private Pacient pacient;

    @Column(name = "valoare")
    private Double valoare;

    @Column(name = "timestamp_masurare")
    private LocalDateTime timestampMasurare;

    @PrePersist
    protected void onCreate() {
        if (timestampMasurare == null) {
            timestampMasurare = LocalDateTime.now();
        }
    }
}
