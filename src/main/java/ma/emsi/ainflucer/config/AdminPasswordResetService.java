package ma.emsi.ainflucer.config;

import ma.emsi.ainflucer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import jakarta.transaction.Transactional;

@Service
public class AdminPasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void resetAdminPassword() {
        userRepository.findByEmail("admin@admin.com")
            .ifPresent(admin -> {
                // Reset password to "admin"
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setEnabled(true);
                admin.setAccountValidated(true);
                userRepository.save(admin);
                System.out.println("Admin password has been reset successfully");
            });
    }
}
