package ma.emsi.ainflucer.config;

import lombok.RequiredArgsConstructor;
import ma.emsi.ainflucer.entities.Role;
import ma.emsi.ainflucer.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public void run(String... args) {
        logger.info("Starting roles initialization...");
        
        try {
            cleanupOldRoles();  // Clean up first
            
            // Standard roles
            initRole("ROLE_ADMIN");  // Admin first to ensure it exists
            initRole("ROLE_USER");
            initRole("ROLE_CLIENT");
            initRole("ROLE_CM");
            
            logger.info("Roles initialization completed successfully");
        } catch (Exception e) {
            logger.error("Error during roles initialization", e);
            throw e;
        }
    }
    
    private void cleanupOldRoles() {
        logger.info("Cleaning up old role formats...");
        try {
            // Remove roles without ROLE_ prefix
            roleRepository.findByName("ADMIN").ifPresent(role -> {
                logger.info("Removing old format role: ADMIN");
                roleRepository.delete(role);
            });
        } catch (Exception e) {
            logger.warn("Error during role cleanup", e);
            // Don't throw here, as this is just cleanup
        }
    }
    
    private void initRole(String roleName) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
            logger.info("Created role: {}", roleName);
        } else {
            logger.info("Role already exists: {}", roleName);
        }
    }
}