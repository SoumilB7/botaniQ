package org.example.devsoc25.service;

import com.google.gson.Gson;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.example.devsoc25.SensorData;
import org.example.devsoc25.entity.Plant;
import org.example.devsoc25.repository.PlantRepository;
import org.springframework.stereotype.Service;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@SuppressWarnings("ALL")
@Slf4j
@Service
public class ArduinoService {

    private final PlantRepository plantRepository;

    public ArduinoService(PlantRepository plantRepository) {
        this.plantRepository = plantRepository;
    }

    @Transactional
    public void saveData (SensorData data, long plantid) throws IOException, InterruptedException, URISyntaxException {
        Plant plant = plantRepository.findById(plantid).get();
        data.setSpecies(plant.getName());

        String response="";
        Gson gson = new Gson();
        String jsonRequest = gson.toJson(data);
        //String AI_url="${AI_URL}";
        log.info(jsonRequest);


        URL url = new URL("https://667f-152-58-225-239.ngrok-free.app/health-detect");
        HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("User-Agent", "Mozilla/5.0");

        try (DataOutputStream dos = new DataOutputStream(conn.getOutputStream())) {
            dos.writeBytes(jsonRequest);
        }

        try (BufferedReader bf = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            String line;
            while ((line = bf.readLine()) != null) {
                response=line;
                System.out.println(line);
            }
        }

        //log.info(response);

        String status=this.getVal(response);
        if(status.equals("Healthy"))
            status="OK";
        else if(status.equals("Moderate Stress"))
            status="MID";
        else if(status.equals("High Stress"))
            status="HIGH";
        log.info("Status is "+status);

        plant.setStatus(status);
        plant.setSensors(data);

        plantRepository.save(plant);
    }

    String getVal(String json){
// Find the index of the key "status" followed by the value's opening quote
        int keyIndex = json.indexOf("\"status\":\"");
        // Calculate the start index of the value (after the opening quote)
        int valueStartIndex = keyIndex + "\"status\":\"".length();

        // Find the closing quote of the value
        int valueEndIndex = json.indexOf("\"", valueStartIndex);
        // Extract the value
        String value = json.substring(valueStartIndex, valueEndIndex);
        return value;

    }

}
