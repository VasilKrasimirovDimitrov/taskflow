package bg.vasil.taskflow.controller;

import bg.vasil.taskflow.dto.request.ProjectRequest;
import bg.vasil.taskflow.dto.response.ProjectResponse;
import bg.vasil.taskflow.service.ProjectService;
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
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        return ResponseEntity.ok(projectService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(HttpSession session) {
        UUID userId = getSessionUserId(session);
        return ResponseEntity.ok(projectService.findByOwner(userId));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            HttpSession session) {
        UUID userId = getSessionUserId(session);
        ProjectResponse response = projectService.create(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectRequest request,
            HttpSession session) {
        UUID userId = getSessionUserId(session);
        return ResponseEntity.ok(projectService.update(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(
            @PathVariable UUID id,
            HttpSession session) {
        UUID userId = getSessionUserId(session);
        projectService.delete(id, userId);
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully"));
    }

    private UUID getSessionUserId(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        if (userId == null) {
            throw new bg.vasil.taskflow.exception.UnauthorizedActionException("Not authenticated");
        }
        return userId;
    }
}
