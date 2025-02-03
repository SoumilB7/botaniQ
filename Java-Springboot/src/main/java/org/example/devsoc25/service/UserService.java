package org.example.devsoc25.service;

import org.example.devsoc25.entity.User;
import org.example.devsoc25.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.logging.Logger;

@Service
public class UserService {

    private static final Logger log = Logger.getLogger(UserService.class.getName());

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        String rawpw=user.getPassword();
        String hashedpw= BCrypt.hashpw(rawpw, BCrypt.gensalt(10));
        user.setPassword(hashedpw);
        return userRepository.save(user);
    }

    public Optional<User> authUser(String email, String password) {
            Optional<User> user = userRepository.findByEmail(email);
            if(user.isEmpty()){
                log.info("User "+email+" not found!!!");
                return Optional.empty();
            }
            if(!BCrypt.checkpw(password, user.get().getPassword())){
                log.info("Wrong password!!!"+password);
                return Optional.empty();
            }
            return user;

    }
}
