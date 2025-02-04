package org.example.devsoc25.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.devsoc25.SensorData;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@SuppressWarnings("unused")
@Setter
@Getter
@Entity
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long plantid;

    private String name;
    private String image;
    private String description;
    private String status;
    private float soil_moisture;
    private float temperature;
    private float humidity;
    private float light;

    @ManyToOne(optional = false)
    @JoinColumn(name = "userid",nullable=false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @Override
    public String toString() {
        return "Plant{" +
                "plantid=" + plantid +
                ", name='" + name + '\'' +
                ", image='" + image + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", soil_moisture=" + soil_moisture +
                ", temperature=" + temperature +
                ", humidity=" + humidity +
                ", light=" + light +
                ", user=" + user.getUsername() +
                '}';
    }

    public void setSensors(SensorData sensorData){
        this.humidity = sensorData.getHumidity();
        this.light= sensorData.getlightIntensity();
        this.soil_moisture= sensorData.getsoilMoisture();
        this.temperature= sensorData.getAmbientTemperature();
    }

    public Plant() {
    }

    public Plant(String name, String image, String description, String status, float soil_moisture, float temperature, float humidity, float light, User user) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.status = status;
        this.soil_moisture = soil_moisture;
        this.temperature = temperature;
        this.humidity = humidity;
        this.light = light;
        this.user = user;
    }

}
