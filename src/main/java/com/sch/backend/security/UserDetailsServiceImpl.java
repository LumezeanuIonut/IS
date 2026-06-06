package com.sch.backend.security;

import com.sch.backend.entity.Utilizator;
import com.sch.backend.repository.UtilizatorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UtilizatorRepository utilizatorRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilizator utilizator = utilizatorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utilizatorul cu email-ul '" + email + "' nu a fost găsit"));

        // .roles() adaugă automat prefixul ROLE_ → ROLE_medic, ROLE_admin, etc.
        return User.builder()
                .username(utilizator.getEmail())
                .password(utilizator.getParolaHash())
                .roles(utilizator.getRol().name())
                .build();
    }
}
