package bg.vasil.taskflow.dto.response;

import bg.vasil.taskflow.entity.Role;
import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private Set<Role> roles;
}
