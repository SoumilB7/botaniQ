package org.example.devsoc25.service;

import com.google.gson.Gson;
import org.example.devsoc25.entity.Plant;
import org.example.devsoc25.entity.User;
import org.example.devsoc25.repository.PlantRepository;
import org.example.devsoc25.repository.UserRepository;
import org.springframework.boot.json.GsonJsonParser;
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
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@SuppressWarnings("ALL")
@Service
public class PlantService {
    private static final Logger log = Logger.getLogger(UserService.class.getName());
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;

    public PlantService(PlantRepository plantRepository, UserRepository userRepository) {
        this.plantRepository = plantRepository;
        this.userRepository = userRepository;
    }


    public Plant savePlant(Plant plant, long userId)  {
        Optional<User> user = userRepository.findById(userId);
        plant.setUser(user.get());

//        String response="";
//        Gson gson = new Gson();
//        String jsonRequest = "{\"image\":\""+image+"\"}";
//
//        try {
//            URL url = new URL("https://667f-152-58-225-239.ngrok-free.app/image-classify");
//            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
//            conn.setRequestMethod("POST");
//            conn.setDoOutput(true);
//            conn.setRequestProperty("Content-Type", "application/json");
//            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
//
//            try (DataOutputStream dos = new DataOutputStream(conn.getOutputStream())) {
//                dos.writeBytes(jsonRequest);
//            }
//
//            try (BufferedReader bf = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
//                String line;
//                while ((line = bf.readLine()) != null) {
//                    response+=line;
//                    System.out.println(line);
//                }
//            }
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }


        //HashMap<String,String> map = gson.fromJson(response,HashMap.class);
        //log.info(map.get("name")+"   "+map.get("description"));
//        plant.setName(map.get("name"));
//        plant.setDescription(map.get("description"));

        return plantRepository.save(plant);
    }

    public List<Plant> getAll(long userid) {
        Optional<List<Plant>> plants = plantRepository.findAllByUserUserid(userid);
        //log.info(plants.get().toString());
        return plants.get();
    }

    String getVal(String json) {
// Find the index of the key "status" followed by the value's opening quote
        int keyIndex = json.indexOf("\"name\":\"");
        // Calculate the start index of the value (after the opening quote)
        int valueStartIndex = keyIndex + "\"name\":\"".length();

        // Find the closing quote of the value
        int valueEndIndex = json.indexOf("\"", valueStartIndex);
        // Extract the value
        String value = json.substring(valueStartIndex, valueEndIndex);
        return value;

    }

}