package ma.emsi.ainflucer.Controller;

import ma.emsi.ainflucer.dto.LoginDTO;
import ma.emsi.ainflucer.dto.RegisterDTO;
import ma.emsi.ainflucer.dto.AuthResponse;
import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.security.JwtUtils;
import ma.emsi.ainflucer.service.AuthService;
import org.springframework.http.HttpStatus;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthService authService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            System.out.println("Tentative de connexion pour l'utilisateur: " + loginDTO.getEmail());
            var userDetails = authService.authenticate(loginDTO);
            var token = jwtUtils.generateToken(userDetails);
            User user = (User) userDetails;
            
            System.out.println("Connexion réussie pour l'utilisateur: " + user.getUsername());
            System.out.println("Rôle: " + user.getRole().getName());
            System.out.println("Compte validé: " + user.isAccountValidated());
            System.out.println("Compte activé: " + user.isEnabled());
            
            return ResponseEntity.ok(new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getRole().getName(),
                user.isAccountValidated(),
                user.isEnabled()
            ));
        } catch (Exception e) {
            System.out.println("Erreur lors de la connexion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        try {
            User user = authService.register(registerDTO);
            return ResponseEntity.ok(Map.of(
                "message", "Inscription réussie. Votre compte est en attente de validation par un administrateur.",
                "username", user.getUsername()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}