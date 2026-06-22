package bg.vasil.taskflow.service.impl;

import bg.vasil.taskflow.dto.request.ProjectRequest;
import bg.vasil.taskflow.dto.response.ProjectResponse;
import bg.vasil.taskflow.entity.Project;
import bg.vasil.taskflow.entity.Role;
import bg.vasil.taskflow.entity.User;
import bg.vasil.taskflow.exception.ResourceNotFoundException;
import bg.vasil.taskflow.exception.UnauthorizedActionException;
import bg.vasil.taskflow.repository.ProjectRepository;
import bg.vasil.taskflow.service.ProjectService;
import bg.vasil.taskflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    @Override
    public ProjectResponse create(ProjectRequest request, UUID ownerId) {
        User owner = userService.findById(ownerId);

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .owner(owner)
                .build();

        return mapToResponse(projectRepository.save(project));
    }

    @Override
    public ProjectResponse update(UUID projectId, ProjectRequest request, UUID requesterId) {
        Project project = getProjectOrThrow(projectId);
        checkOwnerOrAdmin(project, requesterId);

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setDeadline(request.getDeadline());

        return mapToResponse(projectRepository.save(project));
    }

    @Override
    public void delete(UUID projectId, UUID requesterId) {
        Project project = getProjectOrThrow(projectId);
        checkOwnerOrAdmin(project, requesterId);
        projectRepository.delete(project);
    }

    @Override
    public ProjectResponse findById(UUID projectId) {
        return mapToResponse(getProjectOrThrow(projectId));
    }

    @Override
    public List<ProjectResponse> findAll() {
        return projectRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ProjectResponse> findByOwner(UUID ownerId) {
        User owner = userService.findById(ownerId);
        return projectRepository.findByOwnerOrderByCreatedAtDesc(owner).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private Project getProjectOrThrow(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private void checkOwnerOrAdmin(Project project, UUID requesterId) {
        User requester = userService.findById(requesterId);
        boolean isOwner = project.getOwner().getId().equals(requesterId);
        boolean isAdmin = requester.getRoles().contains(Role.ADMIN);
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("You do not have permission to modify this project");
        }
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .deadline(project.getDeadline())
                .createdAt(project.getCreatedAt())
                .ownerUsername(project.getOwner().getUsername())
                .ownerId(project.getOwner().getId())
                .taskCount(project.getTasks().size())
                .build();
    }
}
