package ma.emsi.ainflucer.service;

import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.entities.AccountValidation;
import ma.emsi.ainflucer.repository.UserRepository;
import ma.emsi.ainflucer.repository.AccountValidationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class AccountValidationService {

    private final UserRepository userRepository;
    private final AccountValidationRepository validationRepository;

    public AccountValidationService(UserRepository userRepository,
                                  AccountValidationRepository validationRepository) {
        this.userRepository = userRepository;
        this.validationRepository = validationRepository;
    }

    @Transactional
    public User validateAccount(Long userId, User admin, String notes) {
        if (!admin.getRole().getName().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Only administrators can validate accounts");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);
        user.setAccountValidated(true);
        user = userRepository.save(user);

        AccountValidation validation = new AccountValidation();
        validation.setUser(user);
        validation.setValidatedBy(admin);
        validation.setValidatedAt(LocalDateTime.now());
        validation.setValidationNotes(notes);
        validationRepository.save(validation);

        return user;
    }

    public boolean isAccountValidated(Long userId) {
        return userRepository.findById(userId)
            .map(User::isAccountValidated)
            .orElse(false);
    }
}
