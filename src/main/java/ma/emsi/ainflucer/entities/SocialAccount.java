package ma.emsi.ainflucer.entities;

import jakarta.persistence.*;
import lombok.Data;
import ma.emsi.ainflucer.enums.SocialPlatform;

@Data
@Entity
@Table(name = "social_accounts")
public class SocialAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SocialPlatform platform;

    @Column(nullable = false)
    private String accessToken;

    @Column(nullable = false)
    private String accountId;
}

