package org.example.devsoc25.repository;

import org.example.devsoc25.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findById(long id);
    Optional<User> findByEmail(String email);
}

