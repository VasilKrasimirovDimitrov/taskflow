package bg.vasil.taskflow.repository;

import bg.vasil.taskflow.entity.Project;
import bg.vasil.taskflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByOwnerOrderByCreatedAtDesc(User owner);

    List<Project> findAllByOrderByCreatedAtDesc();
}
