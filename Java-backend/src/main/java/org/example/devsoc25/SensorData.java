package org.example.devsoc25;


public class SensorData {


    private String species;
    private int soilMoisture;
    private int ambientTemperature;
    private int humidity;
    private int lightIntensity;

    public SensorData() {
    }

    public SensorData(String Species, int SoilMoisture, int ambientTemperature, int humidity, int LightIntensity) {
        species = Species;
        soilMoisture = SoilMoisture;
        this.ambientTemperature = ambientTemperature;
        this.humidity = humidity;
        lightIntensity = LightIntensity;
    }

    public SensorData(int soilMoisture, int ambientTemperature, int Humidity, int lightIntensity) {
        this.soilMoisture = soilMoisture;
        this.ambientTemperature = ambientTemperature;
        this.humidity = Humidity;
        this.lightIntensity = lightIntensity;
    }

    public int getsoilMoisture() {
        return soilMoisture;
    }

    public void setsoilMoisture(int soilMoisture) {
        this.soilMoisture = soilMoisture;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public int getAmbientTemperature() {
        return ambientTemperature;
    }

    public void setAmbientTemperature(int ambientTemperature) {
        this.ambientTemperature = ambientTemperature;
    }

    public int getHumidity() {
        return humidity;
    }

    public void setHumidity(int Humidity) {
        this.humidity = Humidity;
    }

    public int getlightIntensity() {
        return lightIntensity;
    }

    public void setlightIntensity(int lightIntensity) {
        this.lightIntensity = lightIntensity;
    }

    @Override
    public String toString() {
        return "SensorData{" +
                "soilMoisture=" + soilMoisture +
                ", ambientTemperature=" + ambientTemperature +
                ", humidity=" + humidity +
                ", lightIntensity=" + lightIntensity +
                '}';
    }
}
