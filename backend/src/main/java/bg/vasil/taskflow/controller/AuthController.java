package bg.vasil.taskflow.controller;

import bg.vasil.taskflow.dto.request.LoginRequest;
import bg.vasil.taskflow.dto.request.RegisterRequest;
import bg.vasil.taskflow.dto.response.UserResponse;
import bg.vasil.taskflow.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String SESSION_USER_ID = "userId";
    private static final String SESSION_USERNAME = "username";

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        UserResponse response = userService.login(request);
        session.setAttribute(SESSION_USER_ID, response.getId());
        session.setAttribute(SESSION_USERNAME, response.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(HttpSession session) {
        UUID userId = (UUID) session.getAttribute(SESSION_USER_ID);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(userService.getUserById(userId));
    }
}
