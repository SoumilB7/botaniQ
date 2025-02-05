package org.example.devsoc25.Controller;

import org.example.devsoc25.PlantBody;
import org.example.devsoc25.entity.Plant;
import org.example.devsoc25.service.PlantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/app")
public class PlantController {

    private final PlantService plantService;

    public PlantController(org.example.devsoc25.service.PlantService plantService) {
        this.plantService = plantService;
    }

    @PostMapping("/{userid}/save")
    public ResponseEntity<?> savePlant(@RequestBody PlantBody plantBody, @PathVariable long userid) throws URISyntaxException, IOException, InterruptedException {
        String image=plantBody.image;
        Plant plant=new Plant();
        plant.setRecordId(plantBody.recordId);
        plant.setFileName(plantBody.fileName);
        Plant resplant=plantService.savePlant(plant,userid,image);
        return ResponseEntity.ok(resplant);
    }

    @GetMapping("/{userid}/allplants")
    public List<Plant> getAllPlants(@PathVariable long userid) {
        List<Plant> resList=plantService.getAll(userid);
        return resList;
    }
}
