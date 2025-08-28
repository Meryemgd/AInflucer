package ma.emsi.ainflucer.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "account_validations")
public class AccountValidation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("validations")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "validated_by", nullable = false)
    @JsonIgnoreProperties({"validations", "sessions"})
    private User validatedBy;
    
    @Column(name = "validated_at", nullable = false)
    private LocalDateTime validatedAt;
    
    @Column(name = "validation_notes")
    private String validationNotes;
}
