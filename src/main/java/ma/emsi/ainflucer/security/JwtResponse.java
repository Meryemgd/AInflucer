package ma.emsi.ainflucer.security;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String roleName;
    private boolean accountValidated;

    public JwtResponse(String token, String username, String roleName, boolean accountValidated) {
        this.token = token;
        this.username = username;
        this.roleName = roleName;
        this.accountValidated = accountValidated;
    }

    // Getters et Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public boolean isAccountValidated() {
        return accountValidated;
    }

    public void setAccountValidated(boolean accountValidated) {
        this.accountValidated = accountValidated;
    }
}