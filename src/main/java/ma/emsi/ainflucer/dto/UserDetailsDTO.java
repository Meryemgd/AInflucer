package ma.emsi.ainflucer.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDetailsDTO {
    private Long id;
    private String username;
    private String email;
    private String roleName;
    private boolean enabled;
    private boolean accountValidated;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private int sessionCount;
}
