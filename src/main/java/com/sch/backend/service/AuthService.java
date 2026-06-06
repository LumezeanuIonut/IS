package com.sch.backend.service;

import com.sch.backend.dto.request.LoginRequest;
import com.sch.backend.dto.request.RegisterRequest;
import com.sch.backend.dto.response.AuthResponse;
import com.sch.backend.entity.Pacient;
import com.sch.backend.entity.Rol;
import com.sch.backend.entity.Utilizator;
import com.sch.backend.repository.PacientRepository;
import com.sch.backend.repository.UtilizatorRepository;
import com.sch.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilizatorRepository utilizatorRepository;
    private final PacientRepository pacientRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getParola()));

        Utilizator utilizator = utilizatorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu există"));

        return buildAuthResponse(jwtTokenProvider.generateToken(auth), utilizator);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (utilizatorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Adresa de email este deja înregistrată");
        }

        Utilizator utilizator = Utilizator.builder()
                .nume(request.getNume())
                .prenume(request.getPrenume())
                .email(request.getEmail())
                .telefon(request.getTelefon())
                .parolaHash(passwordEncoder.encode(request.getParola()))
                .rol(request.getRol())
                .build();

        utilizatorRepository.save(utilizator);

        // Dacă rolul este 'pacient', se creează automat și înregistrarea din tabela pacienti
        if (utilizator.getRol() == Rol.pacient) {
            Pacient pacient = Pacient.builder()
                    .utilizator(utilizator)
                    .build();
            pacientRepository.save(pacient);
        }

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getParola()));

        return buildAuthResponse(jwtTokenProvider.generateToken(auth), utilizator);
    }

    private AuthResponse buildAuthResponse(String token, Utilizator utilizator) {
        return AuthResponse.builder()
                .token(token)
                .tip("Bearer")
                .email(utilizator.getEmail())
                .rol(utilizator.getRol().name())
                .build();
    }
}
