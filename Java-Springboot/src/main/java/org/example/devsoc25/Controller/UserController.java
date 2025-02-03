package org.example.devsoc25.Controller;

import org.example.devsoc25.entity.User;
import org.example.devsoc25.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/user")
public class UserController {
    private static final Logger log = Logger.getLogger(UserController.class.getName());


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String,Object>> saveUser(@RequestBody User user) {
        User resUser= userService.saveUser(user);
        Map<String, Object> response = new HashMap<>();
        response.put("userId", resUser.getUserid());
        response.put("enabled", resUser.isEnabled());
        response.put("authToken", resUser.getAuthtoken());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        Optional<User> resUser= userService.authUser(email,password);
        if(resUser.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("userId", resUser.get().getUserid());
        response.put("enabled", resUser.get().isEnabled());
        response.put("authToken", resUser.get().getAuthtoken());

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);

    }

}
