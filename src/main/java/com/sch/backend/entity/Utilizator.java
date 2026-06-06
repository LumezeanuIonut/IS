package com.sch.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "utilizatori")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Utilizator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilizator")
    private Integer idUtilizator;

    @Column(name = "nume", nullable = false, length = 100)
    private String nume;

    @Column(name = "prenume", nullable = false, length = 100)
    private String prenume;

    @Column(name = "email", unique = true, nullable = false, length = 150)
    private String email;

    @Column(name = "telefon", length = 20)
    private String telefon;

    @JsonIgnore
    @Column(name = "parola_hash", nullable = false, length = 255)
    private String parolaHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 50)
    private Rol rol;

    @Column(name = "data_creare")
    private LocalDateTime dataCreare;

    // Bidirectional – ignorat la serializare pentru a evita ciclurile
    @JsonIgnore
    @OneToOne(mappedBy = "utilizator", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Pacient pacient;

    @PrePersist
    protected void onCreate() {
        if (dataCreare == null) {
            dataCreare = LocalDateTime.now();
        }
    }
}
