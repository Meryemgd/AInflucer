package ma.emsi.ainflucer.service;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    // ⚠ Ici c'est juste pour tester (stockage en mémoire, pas en BDD)
    private final Map<String, String> users = new HashMap<>();

    public void register(String username, String password) {
        if (users.containsKey(username)) {
            throw new RuntimeException("Username already exists");
        }
        users.put(username, password);
    }

    public boolean login(String username, String password) {
        return users.containsKey(username) && users.get(username).equals(password);
    }
}
