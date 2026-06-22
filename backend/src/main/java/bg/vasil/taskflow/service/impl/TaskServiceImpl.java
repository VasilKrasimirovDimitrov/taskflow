package bg.vasil.taskflow.service.impl;

import bg.vasil.taskflow.dto.request.TaskRequest;
import bg.vasil.taskflow.dto.response.TaskResponse;
import bg.vasil.taskflow.entity.*;
import bg.vasil.taskflow.exception.ResourceNotFoundException;
import bg.vasil.taskflow.exception.UnauthorizedActionException;
import bg.vasil.taskflow.repository.ProjectRepository;
import bg.vasil.taskflow.repository.TaskRepository;
import bg.vasil.taskflow.service.TaskService;
import bg.vasil.taskflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    @Override
    public TaskResponse create(UUID projectId, TaskRequest request, UUID requesterId) {
        Project project = getProjectOrThrow(projectId);
        checkProjectAccess(project, requesterId);

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userService.findById(request.getAssigneeId());
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .project(project)
                .assignee(assignee)
                .build();

        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse update(UUID taskId, TaskRequest request, UUID requesterId) {
        Task task = getTaskOrThrow(taskId);
        checkTaskAccess(task, requesterId);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = userService.findById(request.getAssigneeId());
            task.setAssignee(assignee);
        }

        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public void delete(UUID taskId, UUID requesterId) {
        Task task = getTaskOrThrow(taskId);
        checkTaskAccess(task, requesterId);
        taskRepository.delete(task);
    }

    @Override
    public TaskResponse findById(UUID taskId) {
        return mapToResponse(getTaskOrThrow(taskId));
    }

    @Override
    public List<TaskResponse> findByProject(UUID projectId) {
        return taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<TaskResponse> findByAssignee(UUID assigneeId) {
        User assignee = userService.findById(assigneeId);
        return taskRepository.findByAssigneeOrderByCreatedAtDesc(assignee).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TaskResponse changeStatus(UUID taskId, TaskStatus newStatus, UUID requesterId) {
        Task task = getTaskOrThrow(taskId);
        checkTaskAccess(task, requesterId);
        task.setStatus(newStatus);
        return mapToResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse assignTask(UUID taskId, UUID assigneeId, UUID requesterId) {
        Task task = getTaskOrThrow(taskId);
        checkProjectOwnerOrAdmin(task.getProject(), requesterId);

        User assignee = userService.findById(assigneeId);
        task.setAssignee(assignee);
        return mapToResponse(taskRepository.save(task));
    }

    private Task getTaskOrThrow(UUID taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
    }

    private Project getProjectOrThrow(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private void checkProjectAccess(Project project, UUID requesterId) {
        User requester = userService.findById(requesterId);
        boolean isOwner = project.getOwner().getId().equals(requesterId);
        boolean isAdmin = requester.getRoles().contains(Role.ADMIN);
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("You do not have access to this project");
        }
    }

    private void checkTaskAccess(Task task, UUID requesterId) {
        User requester = userService.findById(requesterId);
        boolean isProjectOwner = task.getProject().getOwner().getId().equals(requesterId);
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(requesterId);
        boolean isAdmin = requester.getRoles().contains(Role.ADMIN);
        if (!isProjectOwner && !isAssignee && !isAdmin) {
            throw new UnauthorizedActionException("You do not have permission to modify this task");
        }
    }

    private void checkProjectOwnerOrAdmin(Project project, UUID requesterId) {
        User requester = userService.findById(requesterId);
        boolean isOwner = project.getOwner().getId().equals(requesterId);
        boolean isAdmin = requester.getRoles().contains(Role.ADMIN);
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("Only the project owner can assign tasks");
        }
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .projectId(task.getProject().getId())
                .projectTitle(task.getProject().getTitle())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .assigneeUsername(task.getAssignee() != null ? task.getAssignee().getUsername() : null)
                .build();
    }
}
