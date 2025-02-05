#include <SoftwareSerial.h>
#include <DHT.h>

SoftwareSerial espSerial(10, 11);  
const int LED_PIN = LED_BUILTIN;

// Sensor pins
#define R0581_ANALOG_PIN A0
#define RO313_PIN 2
#define LIGHT_SENSOR_PIN A1
DHT dht(RO313_PIN, DHT11);

// WiFi credentials
const char* SSID = "China7G";
const char* PASS = "peepeepoopoo";

// Server details
const char* SERVER_IP = "172.22.166.125";  // Replace with your computer's local IP
const int SERVER_PORT = 3001;

unsigned long previousSend = 0;
const long SEND_INTERVAL = 45000;  // 45 seconds

// Error codes
#define ERR_WIFI_CONNECT 1
#define ERR_TCP_CONNECT 2
#define ERR_HTTP_SEND 3
#define ERR_CLOSE_CONNECTION 4

void setup() 
{
  digitalWrite(LED_PIN, LOW);  // LED off by default
  pinMode(LIGHT_SENSOR_PIN, INPUT);
  Serial.begin(9600);
  espSerial.begin(115200);
  dht.begin();

  if (!connectToWiFi()) 
  {
    reportError(ERR_WIFI_CONNECT);
  }
} 

void loop() 
{
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousSend >= SEND_INTERVAL) 
  {
    previousSend = currentMillis;
    int errorCode = sendSensorData();
    if (errorCode == 0) 
    {
      blinkLED(1);  // Single blink for success
      Serial.println("Data sent successfully");
    } 
    else
    {
      blinkLED(2);  // Double blink for failure
      reportError(errorCode);
    }
  }
}

bool connectToWiFi() 
{
  sendATCommand("AT+RST", 2000);
  sendATCommand("AT+CWMODE=1", 1000);
  
  String connectCmd = "AT+CWJAP=\"" + String(SSID) + "\",\"" + String(PASS) + "\"";
  return sendATCommand(connectCmd, 15000);
}

int sendSensorData() 
{
  float soilMoisture = analogRead(R0581_ANALOG_PIN); 
  soilMoisture= -0.0304878 * soilMoisture +  46.0976;
;
  float humidity = dht.readHumidity()-10;
  float temperature = dht.readTemperature();
  int lightLevel = analogRead(LIGHT_SENSOR_PIN)+550;
  // Create JSON payload
  String payload = "{";
  payload += "\"soilMoisture\":" + String(soilMoisture) + ",";
  payload += "\"ambientTemperature\":" + String(temperature) + ",";
  payload += "\"humidity\":" + String(humidity) + ",";
  payload += "\"lightIntensity\":" + String(lightLevel);
  payload += "}";

  // Prepare AT commands for HTTP POST
  String cmd = "AT+CIPSTART=\"TCP\",\"" + String(SERVER_IP) + "\"," + String(SERVER_PORT);
  if (!sendATCommand(cmd, 5000)) 
  {
    return ERR_TCP_CONNECT;
  }

  String postRequest = "POST /api/data HTTP/1.1\r\n";
  postRequest += "Host: " + String(SERVER_IP) + "\r\n";
  postRequest += "Content-Type: application/json\r\n";
  postRequest += "Content-Length: " + String(payload.length()) + "\r\n\r\n";
  postRequest += payload;

  if (!sendATCommand("AT+CIPSEND=" + String(postRequest.length()), 2000) ||
      !sendATCommand(postRequest, 5000))
  {
    return ERR_HTTP_SEND;
  }

  if (!sendATCommand("AT+CIPCLOSE", 1000))
  {
    return ERR_CLOSE_CONNECTION;
  }

  return 0;  // Success
}

bool sendATCommand(String cmd, unsigned long timeout) 
{
  espSerial.println(cmd);
  unsigned long start = millis();
  String response = "";

  while (millis() - start < timeout)
    {
    while (espSerial.available()) 
    {
      char c = espSerial.read();
      response += c;
    }
    if (response.indexOf("OK") != -1) return true;
    if (response.indexOf("ERROR") != -1) return false;
  }
  return false;
}

void blinkLED(int times) 
{
  for (int i = 0; i < times; i++)
    {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(200);
  }
}

void reportError(int errorCode) 
{
  Serial.print("Error Code: ");
  Serial.print(errorCode);
  Serial.print(" - ");
  switch(errorCode) 
  {
    case ERR_WIFI_CONNECT:
      Serial.println("Failed to connect to WiFi");
      break;
    case ERR_TCP_CONNECT:
      Serial.println("Failed to establish TCP connection");
      break;
    case ERR_HTTP_SEND:
      Serial.println("Failed to send HTTP request");
      break;
    case ERR_CLOSE_CONNECTION:
      Serial.println("Failed to close TCP connection");
      break;
    default:
      Serial.println("Unknown error");
  }
}
