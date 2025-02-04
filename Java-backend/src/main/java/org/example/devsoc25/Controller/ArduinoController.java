package org.example.devsoc25.Controller;

import lombok.extern.slf4j.Slf4j;
import org.example.devsoc25.SensorData;
import org.example.devsoc25.service.ArduinoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URISyntaxException;

@Slf4j
@RestController
@RequestMapping("/uno")
public class ArduinoController {
    private final ArduinoService arduinoService;

    public ArduinoController(ArduinoService arduinoService) {
        this.arduinoService = arduinoService;
    }

    @PostMapping("/{plantid}/data")
    public HttpStatus logInfo(@RequestBody SensorData sensorData,
                              @PathVariable long plantid) throws IOException, URISyntaxException, InterruptedException {
        arduinoService.saveData(sensorData,plantid);
        return HttpStatus.OK;
    }
}
