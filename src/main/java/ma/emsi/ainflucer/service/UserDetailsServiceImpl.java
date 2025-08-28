package ma.emsi.ainflucer.service;

import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Tentative de chargement de l'utilisateur: " + username);
        try {
            System.out.println("UserDetailsService - Recherche utilisateur par email: " + username);
            UserDetails user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + username));
            System.out.println("Utilisateur trouvé: " + username);
            System.out.println("Rôle de l'utilisateur: " + ((User)user).getRole().getName());
            System.out.println("Compte activé: " + user.isEnabled());
            return user;
        } catch (Exception e) {
            System.out.println("Erreur lors du chargement de l'utilisateur: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}