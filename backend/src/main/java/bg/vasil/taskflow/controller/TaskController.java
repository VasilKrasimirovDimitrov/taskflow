package bg.vasil.taskflow.controller;

import bg.vasil.taskflow.dto.request.TaskRequest;
import bg.vasil.taskflow.dto.response.TaskResponse;
import bg.vasil.taskflow.entity.TaskStatus;
import bg.vasil.taskflow.exception.UnauthorizedActionException;
import bg.vasil.taskflow.service.TaskService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskResponse>> getProjectTasks(@PathVariable UUID projectId) {
        return ResponseEntity.ok(taskService.findByProject(projectId));
    }

    @GetMapping("/tasks/my")
    public ResponseEntity<List<TaskResponse>> getMyTasks(HttpSession session) {
        UUID userId = getSessionUserId(session);
        return ResponseEntity.ok(taskService.findByAssignee(userId));
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody TaskRequest request,
            HttpSession session) {
        UUID userId = getSessionUserId(session);
        TaskResponse response = taskService.create(projectId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID id,
            @Valid @RequestBody TaskRequest request,
            HttpSession session) {
        UUID userId = getSessionUserId(session);
        return ResponseEntity.ok(taskService.update(id, request, userId));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(
            @PathVariable UUID id,
            HttpSession session) {
        UUID userId = getSessionUserId(session);
        taskService.delete(id, userId);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }

    @PatchMapping("/tasks/{id}/status")
    public ResponseEntity<TaskResponse> changeStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            HttpSession session) {
        UUID userId = getSessionUserId(session);
        TaskStatus status = TaskStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(taskService.changeStatus(id, status, userId));
    }

    @PatchMapping("/tasks/{id}/assign")
    public ResponseEntity<TaskResponse> assignTask(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            HttpSession session) {
        UUID userId = getSessionUserId(session);
        UUID assigneeId = UUID.fromString(body.get("assigneeId"));
        return ResponseEntity.ok(taskService.assignTask(id, assigneeId, userId));
    }

    private UUID getSessionUserId(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedActionException("Not authenticated");
        }
        return userId;
    }
}
