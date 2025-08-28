package ma.emsi.ainflucer.service;

import ma.emsi.ainflucer.dto.UserDetailsDTO;
import ma.emsi.ainflucer.entities.User;
import ma.emsi.ainflucer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    public List<UserDetailsDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void validateUserAccount(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setAccountValidated(true);
            user.setEnabled(true);
            userRepository.save(user);
        });
    }

    @Transactional
    public void invalidateUserAccount(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setAccountValidated(false);
            user.setEnabled(false);
            userRepository.save(user);
        });
    }

    private UserDetailsDTO convertToDTO(User user) {
        UserDetailsDTO dto = new UserDetailsDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoleName(user.getRole() != null ? user.getRole().getName() : "N/A");
        dto.setEnabled(user.isEnabled());
        dto.setAccountValidated(user.isAccountValidated());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLogin(user.getLastLogin());
        dto.setSessionCount(user.getSessions() != null ? user.getSessions().size() : 0);
        return dto;
    }
}
