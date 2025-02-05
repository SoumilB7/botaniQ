# 🌱 botaniQ – Smart Plant Monitoring System 🌿  

**Bringing intelligence to plant care with IoT & AI**  

---

## 🚀 Overview  

botaniQ is an **AI-powered, IoT-driven** plant monitoring system designed for **real-time tracking of soil health, temperature, humidity, and light exposure**. Whether you're an urban gardener, a farmer, or a tech enthusiast, botaniQ ensures your plants thrive with **automated insights and remote monitoring**.  

🔹 **Smart Sensors**: Detects real-time soil moisture, temperature, humidity, and light levels.  
🔹 **IoT Connectivity**: Remotely access plant health data via WiFi.  
🔹 **AI-Driven Insights**: Provides data-driven recommendations for optimal plant growth.  
🔹 **Hackable & Expandable**: Open-source and modular for DIY enhancements.  

---

## 🔧 Hardware Components  

botaniQ is built with a **robust yet cost-effective hardware stack**, ensuring precision and scalability:  

| Component  | Description |
|------------|------------|
| **Arduino Uno R3 (SMD)** | The brain of the system, handling sensor data and logic execution. |
| **ESP01 WiFi Module (ESP8266)** | Enables wireless connectivity for remote monitoring. |
| **HW-103 Soil Moisture Sensor** | Measures soil humidity levels to optimize watering schedules. |
| **DHT11 Sensor** | Monitors temperature and humidity for plant health insights. |
| **Photo Diode** | Detects ambient light levels to ensure plants receive optimal sunlight. |

---

## 🛠️ How It Works  

1. **Data Collection**: Sensors capture real-time environmental parameters like soil moisture, temperature, humidity, and light levels.  

2. **Processing & Analysis**: The Arduino processes the data, while the ESP8266 transmits it to a cloud platform for further analysis.  

3. **Image Capture & Plant Identification**: Users can capture an image of the plant, which is then analyzed to identify its species and added as a card for tracking.  

4. **IoT Connectivity**: The system sends real-time updates to a cloud dashboard, allowing users to monitor plant health remotely.  

5. **User Interface**: Data and images are displayed on a web or mobile dashboard, providing insights into plant care.  

6. **Automated Alerts**: The system notifies users when conditions become unfavorable, ensuring timely intervention.  
  

---

## 🚀 Getting Started  

### 🔹 Prerequisites  

Ensure you have the following installed:  

- **Arduino IDE** (for coding and uploading firmware)  
- **ESP8266 Libraries** (for WiFi communication)  
- **DHT11 & Soil Moisture Libraries** (for sensor interfacing)  

### 🔹 Installation  

1. Clone the repository:  

   ```bash
   git clone https://github.com/SoumilB7/botaniQ.git
   cd botaniQ
   ```
 2. Open the Arduino project in **Arduino IDE**.  

3. Connect the **Arduino Uno R3** via USB and upload the firmware.  

4. Configure the **ESP01 WiFi credentials** in the code.  

5. Power on the system and start monitoring your plants! 🌿  

---

## 📌 Features  

✔ **Real-time Sensor Readings** 📊  
✔ **Wireless Connectivity via ESP8266** 📡  
✔ **Customizable Threshold Alerts** ⚠  
✔ **Scalable & Open-Source for DIY Enhancements** 🛠  

---

## Presentation link 
- https://www.canva.com/design/DAGeD8AT4DM/buknE9xSQxdCm2zLUTl-uQ/edit?utm_content=DAGeD8AT4DM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
