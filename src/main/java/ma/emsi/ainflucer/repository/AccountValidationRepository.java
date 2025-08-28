package ma.emsi.ainflucer.repository;

import ma.emsi.ainflucer.entities.AccountValidation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccountValidationRepository extends JpaRepository<AccountValidation, Long> {
    // Méthodes personnalisées pour trouver les validations par utilisateur
    List<AccountValidation> findByUserId(Long userId);
    
    // Méthodes pour trouver les validations effectuées par un admin
    List<AccountValidation> findByValidatedById(Long adminId);
}
