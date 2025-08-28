package ma.emsi.ainflucer.config;

import ma.emsi.ainflucer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import jakarta.transaction.Transactional;

@Service
public class AdminAccountSetupService {

    @Autowired
    private UserRepository userRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void setupAdminAccount() {
        userRepository.findByEmail("admin@gmail.com")
            .ifPresent(admin -> {
                admin.setEnabled(true);
                admin.setAccountValidated(true);
                userRepository.save(admin);
                System.out.println("Le compte administrateur (Admin1) a été activé avec succès");
            });
    }
}
