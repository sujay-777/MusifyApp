package in.bushansigur.musifyapi.controller;

import in.bushansigur.musifyapi.document.User;
import in.bushansigur.musifyapi.dto.AuthRequest;
import in.bushansigur.musifyapi.dto.AuthResponse;
import in.bushansigur.musifyapi.dto.RegisterRequest;
import in.bushansigur.musifyapi.dto.UserResponse;
import in.bushansigur.musifyapi.service.AppUserDetailsService;
import in.bushansigur.musifyapi.service.UserService;
import in.bushansigur.musifyapi.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            User existingUser = userService.findByEmail(request.getEmail());
            if (request.getPortal().equalsIgnoreCase("admin") &&
                        existingUser.getRole().name().equalsIgnoreCase("USER")) {
                return ResponseEntity.badRequest().body("Email/Password is incorrect");
            }

            //Authenticate the user
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            //Load user details
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());


            //Generate jwt token
            String token = jwtUtil.generateToken(userDetails, existingUser.getRole().name());

            return ResponseEntity.ok(new AuthResponse(token, request.getEmail(), existingUser.getRole().name()));
        }catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Email/Password is incorrect");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            UserResponse response = userService.registerUser(request);
            return ResponseEntity.ok(response);
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/promote-admin")
    public ResponseEntity<?> promoteToAdmin(@RequestBody Map<String, String> request) {
        try {
            User user = userService.promoteToAdmin(request.get("email"));
            return ResponseEntity.ok(new AuthResponse(null, user.getEmail(), "ADMIN"));
        }catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body("Failed to promote user to admin");
        }
    }
}
