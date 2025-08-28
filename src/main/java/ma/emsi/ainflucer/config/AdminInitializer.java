package ma.emsi.ainflucer.config;

import ma.emsi.ainflucer.entities.Role;
import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.repository.RoleRepository;
import ma.emsi.ainflucer.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@Order(2)  // Run after DataInitializer
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Vérification de l'existence d'un compte administrateur...");
        
        String adminEmail = "admin@admin.com";
        
        if (!userRepository.existsByEmail(adminEmail)) {
            logger.info("Création du compte administrateur...");
            
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Le rôle ROLE_ADMIN n'existe pas"));

            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("Admin123"));
            admin.setRole(adminRole);
            admin.setEnabled(true);
            admin.setAccountValidated(true);
            admin.setCreatedAt(LocalDateTime.now());
            
            userRepository.save(admin);
            logger.info("Compte administrateur créé avec succès");
        } else {
            logger.info("Le compte administrateur existe déjà");
            // Mise à jour des propriétés de l'admin existant si nécessaire
            userRepository.findByEmail(adminEmail).ifPresent(admin -> {
                if (!admin.getRole().getName().equals("ROLE_ADMIN")) {
                    Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                            .orElseThrow(() -> new RuntimeException("Le rôle ROLE_ADMIN n'existe pas"));
                    admin.setRole(adminRole);
                    admin.setEnabled(true);
                    admin.setAccountValidated(true);
                    userRepository.save(admin);
                    logger.info("Rôle administrateur mis à jour");
                }
            });
        }
    }
}
