import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import PlantModal from "@/components/PlantModal";
import { useAuth } from "@/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backend } from "@/app/constants";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { blurhash } from "@/app/constants";
import { Image } from "expo-image";

interface Plant {
  plantId: number;
  name: string;
  description: string;
  recordId: string;
  fileName: string;
  temperature: number;
  humidity: number;
  status: "HIGH" | "MID" | "OK";
  soil_moisture: number;
  moistureData: number[];
  image: string;
}

const getAll = async (userId: number) => {
  const response = await axios.get(`${backend}/app/${userId}/allplants`);
  return response.data;
};

const getCurrentDayIndex = () => {
  return new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
};

const initializeMoistureData = async (plant: Plant) => {
  try {
    const existingData = await AsyncStorage.getItem(plant.plantId.toString());
    if (existingData === null) {
      // Initialize new array with 7 null values
      const newData = new Array(7).fill(null);
      // Set current day's moisture value
      const currentDay = getCurrentDayIndex();
      newData[currentDay] = plant.soil_moisture;
      await AsyncStorage.setItem(plant.plantId.toString(), JSON.stringify(newData));
      return newData;
    } else {
      // Update existing data for current day
      const moistureData = JSON.parse(existingData);
      const currentDay = getCurrentDayIndex();
      moistureData[currentDay] = plant.soil_moisture;
      await AsyncStorage.setItem(plant.plantId.toString(), JSON.stringify(moistureData));
      return moistureData;
    }
  } catch (error) {
    console.error("Error handling moisture data:", error);
    return new Array(7).fill(null);
  }
};

export default function Page() {
  const { userId } = useAuth();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [temperature, setTemperature] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  const [noPlants, setNoPlants] = useState(false);


  useEffect(() => {
    const fetchPlants = async () => {
      try {
        if (userId) {
          const data = await getAll(userId);
          const plantsWithMoistureData = await Promise.all(
            data.map(async (plant: Plant) => {
              const moistureData = await initializeMoistureData(plant);
              return {
                ...plant,
                moistureData,
                image: `https://botaniq.pockethost.io/api/files/image/${plant.recordId}/${plant.fileName}`
              };
            })
          );
          
          setPlants(plantsWithMoistureData);
          
          // Set temperature and humidity from the first plant
          if (plantsWithMoistureData.length > 0) {
            setTemperature(plantsWithMoistureData[0].temperature);
            setHumidity(plantsWithMoistureData[0].humidity);
          }
        }
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    fetchPlants();
  }, [userId]);

  // Helper function to get border color based on status
  const getStatusColor = (status: "HIGH" | "MID" | "OK") => {
    switch (status) {
      case "OK":
        return "#4CAF50";
      case "MID":
        return "#FFC107";
      case "HIGH":
        return "#FF5252";
      default:
        return "#4CAF50";
    }
  };

  const getStatusPriority = (status: "HIGH" | "MID" | "OK") => {
    switch (status) {
      case "OK":
        return 1;
      case "MID":
        return 2;
      case "HIGH":
        return 3;
      default:
        return 3;
    }
  };

  const sortedPlants = [...plants].sort(
    (a, b) => getStatusPriority(a.status) - getStatusPriority(b.status)
  );

  return (
    <View style={styles.pageContainer}>
      {/* Weather Stats Container */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Temperature</Text>
          <Text style={styles.statValue}>{temperature}°C</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Humidity</Text>
          <Text style={styles.statValue}>{humidity}%</Text>
        </View>
      </View>

      {/* Plant Circles ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {sortedPlants.length === 0 && (
          <View style={styles.noPlantsContainer}>
            <Text style={styles.noPlantsText}>No plants found. click camera icon to add plants.</Text>
          </View>
        )}
        {sortedPlants.map((plant) => (
          <TouchableOpacity
            key={plant.plantId}
            style={styles.plantCircle}
            onPress={() => {
              setSelectedPlant(plant);
              setModalVisible(true);
            }}
          >
            <View
              style={[
                styles.circlePlaceholder,
                { borderColor: getStatusColor(plant.status) },
              ]}
            >
              <Image
                style={styles.image}
                source={{ uri: plant.image }}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Plant Recommendations Section */}
      <TouchableOpacity>
        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Plant Recommendations</Text>
          <Text style={styles.recommendationText}>
            Based on your local climate and care preferences, here are some plants
            that would thrive in your space. These plants are known for their
            air-purifying qualities and easy maintenance requirements.
          </Text>
        </View>
      </TouchableOpacity>
      {/* Show All Plants Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/ShowAll")}
      >
        <Text style={styles.buttonText}>Show all plants</Text>
      </TouchableOpacity>

      <PlantModal
        plant={selectedPlant}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noPlantsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15
  },
  noPlantsText: {
    textAlign: "center",
    color: "#666",
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#e0e6e9",
    padding: 16,
  },
  image: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "47%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    marginVertical: 20,
  },
  plantCircle: {
    marginRight: 16,
  },
  circlePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  recommendationsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#6e9277",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});