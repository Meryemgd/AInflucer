package ma.emsi.ainflucer.Controller;

import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.service.AccountValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account-validation")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountValidationController {

    private final AccountValidationService validationService;

    public AccountValidationController(AccountValidationService validationService) {
        this.validationService = validationService;
    }

    @PostMapping("/validate/{userId}")
    public ResponseEntity<?> validateAccount(
            @PathVariable Long userId,
            @RequestParam(required = false) String notes,
            @AuthenticationPrincipal User admin) {
        try {
            User validatedUser = validationService.validateAccount(userId, admin, notes);
            return ResponseEntity.ok(Map.of(
                "message", "Compte validé avec succès",
                "username", validatedUser.getUsername()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<?> checkValidationStatus(@PathVariable Long userId) {
        boolean isValidated = validationService.isAccountValidated(userId);
        return ResponseEntity.ok(Map.of(
            "validated", isValidated,
            "message", isValidated ? "Compte validé" : "Compte en attente de validation"
        ));
    }
}
