package ma.emsi.ainflucer.Controller;

import ma.emsi.ainflucer.dto.UserDetailsDTO;
import ma.emsi.ainflucer.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDetailsDTO>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    @PutMapping("/{userId}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> validateUser(@PathVariable Long userId) {
        userManagementService.validateUserAccount(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/invalidate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> invalidateUser(@PathVariable Long userId) {
        userManagementService.invalidateUserAccount(userId);
        return ResponseEntity.ok().build();
    }
}
