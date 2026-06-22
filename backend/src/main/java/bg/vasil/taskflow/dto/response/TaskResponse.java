package bg.vasil.taskflow.dto.response;

import bg.vasil.taskflow.entity.TaskPriority;
import bg.vasil.taskflow.entity.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TaskResponse {
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private UUID projectId;
    private String projectTitle;
    private UUID assigneeId;
    private String assigneeUsername;
}
