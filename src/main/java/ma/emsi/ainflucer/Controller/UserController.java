package ma.emsi.ainflucer.Controller;

import ma.emsi.ainflucer.dto.UserDTO;
import ma.emsi.ainflucer.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/users/{id}/validate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> validateUser(@PathVariable Long id) {
        try {
            System.out.println("Demande de validation pour l'utilisateur ID: " + id);
            
            // Valider l'utilisateur
            UserDTO validatedUser = userService.validateUser(id);
            
            if (validatedUser == null) {
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("Utilisateur validé avec succès: " + validatedUser.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Compte validé avec succès");
            response.put("user", Map.of(
                "id", validatedUser.getId(),
                "username", validatedUser.getUsername(),
                "email", validatedUser.getEmail(),
                "role", validatedUser.getRole(),
                "accountValidated", validatedUser.isAccountValidated(),
                "enabled", true
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Erreur lors de la validation de l'utilisateur: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            errorResponse.put("message", "La validation du compte a échoué");
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            System.out.println("Récupération de la liste des utilisateurs");
            var users = userService.getAllUsers();
            System.out.println("Nombre d'utilisateurs trouvés: " + users.size());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des utilisateurs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "message", "Erreur lors de la récupération des utilisateurs",
                        "error", e.getMessage()
                    ));
        }
    }
}
