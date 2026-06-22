package bg.vasil.taskflow.service;

import bg.vasil.taskflow.dto.request.TaskRequest;
import bg.vasil.taskflow.dto.response.TaskResponse;
import bg.vasil.taskflow.entity.TaskStatus;

import java.util.List;
import java.util.UUID;

public interface TaskService {

    TaskResponse create(UUID projectId, TaskRequest request, UUID requesterId);

    TaskResponse update(UUID taskId, TaskRequest request, UUID requesterId);

    void delete(UUID taskId, UUID requesterId);

    TaskResponse findById(UUID taskId);

    List<TaskResponse> findByProject(UUID projectId);

    List<TaskResponse> findByAssignee(UUID assigneeId);

    TaskResponse changeStatus(UUID taskId, TaskStatus newStatus, UUID requesterId);

    TaskResponse assignTask(UUID taskId, UUID assigneeId, UUID requesterId);
}
