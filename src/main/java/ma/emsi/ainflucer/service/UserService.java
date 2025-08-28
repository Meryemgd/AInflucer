package ma.emsi.ainflucer.service;

import ma.emsi.ainflucer.dto.UserDTO;
import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Vérifier que l'utilisateur n'est pas un admin
        if (user.getRole().getName().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Impossible de supprimer un administrateur");
        }
        
        userRepository.delete(user);
    }

    @Autowired
    private UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public UserDTO validateUser(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            // Valider et activer le compte
            user.setAccountValidated(true);
            user.setEnabled(true);
            
            // Sauvegarder et vérifier
            user = userRepository.save(user);
            
            if (!user.isAccountValidated() || !user.isEnabled()) {
                throw new RuntimeException("Erreur de validation: Le compte n'a pas été correctement validé");
            }
            
            System.out.println("Validation réussie pour l'utilisateur " + user.getUsername() + 
                             " (ID: " + user.getId() + "), " +
                             "Validé: " + user.isAccountValidated() + ", " +
                             "Activé: " + user.isEnabled());
            
            return convertToDTO(user);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la validation de l'utilisateur: " + e.getMessage());
        }
    }

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole().getName(),
            user.isAccountValidated()
        );
    }
}
