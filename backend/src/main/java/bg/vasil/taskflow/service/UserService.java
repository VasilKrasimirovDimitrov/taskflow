package bg.vasil.taskflow.service;

import bg.vasil.taskflow.dto.request.LoginRequest;
import bg.vasil.taskflow.dto.request.RegisterRequest;
import bg.vasil.taskflow.dto.response.UserResponse;
import bg.vasil.taskflow.entity.User;

import java.util.List;
import java.util.UUID;

public interface UserService {

    UserResponse register(RegisterRequest request);

    UserResponse login(LoginRequest request);

    User findById(UUID id);

    User findByUsername(String username);

    UserResponse getUserById(UUID id);

    List<UserResponse> findAll();
}
