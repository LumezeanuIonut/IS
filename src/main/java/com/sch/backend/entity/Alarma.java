package com.sch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alarme")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alarma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alarma")
    private Long idAlarma;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pacient")
    private Pacient pacient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_senzor")
    private Senzor senzor;

    // Valori permise: 'avertizare' | 'critica'  (reflectă CHECK-ul din SQL)
    @Column(name = "tip_alarma", length = 50)
    private String tipAlarma;

    @Column(name = "mesaj", length = 255)
    private String mesaj;

    @Column(name = "timestamp_declansare")
    private LocalDateTime timestampDeclansare;

    // BIT -> Boolean (0 = nerezolvata, 1 = rezolvata)
    @Column(name = "rezolvata")
    private Boolean rezolvata;

    @PrePersist
    protected void onCreate() {
        if (timestampDeclansare == null) {
            timestampDeclansare = LocalDateTime.now();
        }
        if (rezolvata == null) {
            rezolvata = false;
        }
    }
}
