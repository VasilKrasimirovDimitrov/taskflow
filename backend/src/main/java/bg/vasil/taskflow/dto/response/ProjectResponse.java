package bg.vasil.taskflow.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProjectResponse {
    private UUID id;
    private String title;
    private String description;
    private LocalDate deadline;
    private LocalDateTime createdAt;
    private String ownerUsername;
    private UUID ownerId;
    private int taskCount;
}
