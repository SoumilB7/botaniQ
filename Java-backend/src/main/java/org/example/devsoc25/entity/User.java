package org.example.devsoc25.entity;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long userid;

    @Column(nullable=false)
    private String username;

    @Column(unique=true,nullable=false)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(nullable=false)
    private String authtoken;

    @Column
    private boolean enabled;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public long getUserid() {
        return userid;
    }

    public void setUserid(long userid) {
        this.userid = userid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAuthtoken() {
        return authtoken;
    }

    public void setAuthtoken(String authtoken) {
        this.authtoken = authtoken;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public User(String username, String email, String password, String authtoken, boolean enabled) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.authtoken = authtoken;
        this.enabled = enabled;
    }

    public User() {
    }
}
