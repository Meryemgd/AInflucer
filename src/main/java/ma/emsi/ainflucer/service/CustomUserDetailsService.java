package ma.emsi.ainflucer.service;

import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        return userRepository.findByEmail(login)
                .orElseGet(() -> userRepository.findByUsername(login)
                        .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email ou le username: " + login)));
    }
}
