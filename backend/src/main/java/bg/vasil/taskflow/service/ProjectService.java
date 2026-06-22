package bg.vasil.taskflow.service;

import bg.vasil.taskflow.dto.request.ProjectRequest;
import bg.vasil.taskflow.dto.response.ProjectResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    ProjectResponse create(ProjectRequest request, UUID ownerId);

    ProjectResponse update(UUID projectId, ProjectRequest request, UUID requesterId);

    void delete(UUID projectId, UUID requesterId);

    ProjectResponse findById(UUID projectId);

    List<ProjectResponse> findAll();

    List<ProjectResponse> findByOwner(UUID ownerId);
}
