package ma.emsi.ainflucer.service;

import ma.emsi.ainflucer.dto.LoginDTO;
import ma.emsi.ainflucer.dto.RegisterDTO;
import ma.emsi.ainflucer.entities.Role;
import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.repository.RoleRepository;
import ma.emsi.ainflucer.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import ma.emsi.ainflucer.entities.Role;
import ma.emsi.ainflucer.entities.User;
import java.time.LocalDateTime;
import ma.emsi.ainflucer.repository.RoleRepository;
import ma.emsi.ainflucer.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDetails authenticate(LoginDTO loginDTO) {
        System.out.println("Tentative d'authentification pour email: " + loginDTO.getEmail());
        
        // Vérifier d'abord si l'utilisateur existe
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Identifiants invalides"));
        
        System.out.println("Utilisateur trouvé avec email: " + user.getEmail());
        System.out.println("Rôle de l'utilisateur: " + user.getRole().getName());
        System.out.println("Compte validé: " + user.isAccountValidated());
        System.out.println("Compte activé: " + user.isEnabled());

        // Vérifions d'abord si le compte est activé
        if (!user.isEnabled()) {
            throw new RuntimeException("Votre compte est désactivé. Veuillez contacter l'administrateur");
        }

        // Pour les utilisateurs non-admin, on vérifie la validation
        if (!user.getRole().getName().equals("ROLE_ADMIN")) {
            if (!user.isAccountValidated()) {
                throw new RuntimeException("Votre compte est en attente de validation par un administrateur");
            }
        }

        try {
            // On utilise directement l'utilisateur trouvé pour l'authentification
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(), // Utiliser le username stocké
                            loginDTO.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Mettre à jour la dernière connexion
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            System.out.println("Authentification réussie pour: " + user.getUsername());
            System.out.println("Avec le rôle: " + user.getRole().getName());
            
            return (UserDetails) authentication.getPrincipal();
        } catch (Exception e) {
            System.out.println("Erreur d'authentification: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur d'authentification: " + e.getMessage());
        }
    }

    public User register(RegisterDTO registerDTO) {
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(registerDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Récupérer le rôle demandé ou utiliser ROLE_USER par défaut
        Role userRole = roleRepository.findByName(registerDTO.getRoleName() != null ? 
                       registerDTO.getRoleName() : "ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role not found."));

        User user = new User();
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setUsername(registerDTO.getUsername());
        user.setRole(userRole);
        
        // Définir les états initiaux selon le rôle
        boolean isAdminOrCM = userRole.getName().equals("ROLE_ADMIN") || userRole.getName().equals("ROLE_CM");
        user.setEnabled(isAdminOrCM); // Seuls les admins et CM sont activés automatiquement
        user.setAccountValidated(isAdminOrCM); // Seuls les admins et CM sont validés automatiquement
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }
}