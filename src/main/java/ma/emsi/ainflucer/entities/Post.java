package ma.emsi.ainflucer.entities;

import jakarta.persistence.*;
import lombok.Data;
import ma.emsi.ainflucer.enums.PostStatus;
import java.util.Date;

@Data
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status = PostStatus.DRAFT;

    @Column(name = "scheduled_date")
    private Date scheduledDate;

    @Column(name = "approved_by_client", nullable = false)
    private boolean approvedByClient = false;

    @Column(name = "date_creation", updatable = false)
    private Date dateCreation = new Date();
}