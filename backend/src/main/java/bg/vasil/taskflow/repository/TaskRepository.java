package bg.vasil.taskflow.repository;

import bg.vasil.taskflow.entity.Task;
import bg.vasil.taskflow.entity.TaskStatus;
import bg.vasil.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findByProjectIdOrderByCreatedAtDesc(UUID projectId);

    List<Task> findByAssigneeOrderByCreatedAtDesc(User assignee);

    List<Task> findByProjectIdAndStatus(UUID projectId, TaskStatus status);
}
