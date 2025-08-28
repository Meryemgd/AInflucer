package ma.emsi.ainflucer.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String role;
    private String message;
    private boolean accountValidated;
    private boolean enabled;

    public AuthResponse(String token, Long id, String username, String role, boolean accountValidated, boolean enabled) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.role = role;
        this.accountValidated = accountValidated;
        this.enabled = enabled;
        
        if (!accountValidated && !role.equals("ROLE_ADMIN") && !role.equals("ROLE_CM")) {
            this.message = "Votre compte est en attente de validation par un administrateur";
        }
    }
}
