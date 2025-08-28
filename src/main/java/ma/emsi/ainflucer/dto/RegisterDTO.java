package ma.emsi.ainflucer.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String email;
    private String password;
    private String username;
    private String roleName; // "ADMIN", "USER", etc.
}