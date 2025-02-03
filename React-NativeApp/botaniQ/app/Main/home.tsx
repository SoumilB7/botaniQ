import { router } from "expo-router";
import React from "react";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { blurhash } from "@/app/constants";
import { Image } from "expo-image";
import { BarChart } from "react-native-gifted-charts";

interface Plant {
  id: number;
  name: string;
  image: string;
  info: string;
  moistureData: number[];
  currentStatus: "low" | "medium" | "ok";
}

export default function Page() {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Sample data - replace with actual data
  const unsortedPlants = [
    {
      id: 1,
      name: "Monstera",
      image:
        "https://plus.unsplash.com/premium_photo-1672998159540-0a3f849fe3c6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBwbGFudHxlbnwwfHwwfHx8MA%3D%3D",
      info: "Monstera deliciosa, commonly known as the Swiss cheese plant, is famous for its natural leaf holes. It prefers bright, indirect sunlight and moderate watering.",
      moistureData: [62, 60, 55, 70, 68, 62, 58], // Monday to Sunday
      currentStatus: "low",
    },
    {
      id: 2,
      name: "Mycilea",
      image:
        "https://plus.unsplash.com/premium_photo-1668096747185-624626b732f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGdyZWVuJTIwcGxhbnQlMjBwb3R0ZWR8ZW58MHx8MHx8fDA%3D",
      info: "Monstera deliciosa, commonly known as the Swiss cheese plant, is famous for its natural leaf holes. It prefers bright, indirect sunlight and moderate watering.",
      moistureData: [35, 60, 55, 10, 68, 62, 58], // Monday to Sunday
      currentStatus: "ok",
    },
    {
      id: 3,
      name: "Paraphelia",
      image:
        "https://images.unsplash.com/photo-1515542647469-5f9a6b25ef5b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      info: "Monstera deliciosa, commonly known as the Swiss cheese plant, is famous for its natural leaf holes. It prefers bright, indirect sunlight and moderate watering.",
      moistureData: [15, 20, 55, 70, 48, 62, 58], // Monday to Sunday
      currentStatus: "medium",
    },
    {
      id: 4,
      name: "Raphis",
      image: "placeholder-url-1",
      info: "Monstera deliciosa, commonly known as the Swiss cheese plant, is famous for its natural leaf holes. It prefers bright, indirect sunlight and moderate watering.",
      moistureData: [25, 60, 55, 70, 68, 62, 58], // Monday to Sunday
      currentStatus: "low",
    },
  ];

  // Helper function to get border color based on status
  const getStatusColor = (status: "low" | "medium" | "ok") => {
    switch (status) {
      case "ok":
        return "#4CAF50"; // Green
      case "medium":
        return "#FFC107"; // Yellow
      case "low":
        return "#FF5252"; // Red
      default:
        return "#4CAF50";
    }
  };

  const getStatusPriority = (status: "low" | "medium" | "ok") => {
    switch (status) {
      case "low":
        return 1;
      case "medium":
        return 2;
      case "ok":
        return 3;
      default:
        return 3;
    }
  };

  const plants = [...unsortedPlants].sort(
    (a, b) =>
      getStatusPriority(a.currentStatus as "low" | "medium" | "ok") -
      getStatusPriority(b.currentStatus as "low" | "medium" | "ok")
  );

  const MoistureGraph = ({ data }: { data: number[] }) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const barData = data.map((value, index) => ({
      value,
      label: days[index],
      frontColor: "#9db3c1",
      topLabelComponent: () => (
        <Text style={{ color: "#666", fontSize: 12, marginBottom: 4 }}>
          {value}%
        </Text>
      ),
    }));

    return (
      <View style={{ paddingBottom: 20, overflow: "hidden" }}>
        <BarChart
          data={barData}
          width={Dimensions.get("window").width - 64}
          height={200}
          barWidth={30}
          spacing={20}
          hideRules
          xAxisThickness={1}
          yAxisThickness={1}
          xAxisColor="#666"
          yAxisColor="#666"
          yAxisTextStyle={{ color: "#666", fontSize: 12 }}
          noOfSections={4}
          maxValue={100}
          yAxisLabelTexts={["0%", "25%", "50%", "75%", "100%"]}
          labelWidth={30}
        />
      </View>
    );
  };

  return (
    <View style={styles.pageContainer}>
      {/* Weather Stats Container */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Temperature</Text>
          <Text style={styles.statValue}>24°C</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statTitle}>Humidity</Text>
          <Text style={styles.statValue}>65%</Text>
        </View>
      </View>

      {/* Plant Circles ScrollView */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            style={styles.plantCircle}
            onPress={() => {
              setSelectedPlant(plant as Plant);
              setModalVisible(true);
            }}
          >
            <View
              style={[
                styles.circlePlaceholder,
                {
                  borderColor: getStatusColor(
                    plant.currentStatus as "medium" | "low" | "ok"
                  ),
                },
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
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Plant Recommendations</Text>
        <Text style={styles.recommendationText}>
          Based on your local climate and care preferences, here are some plants
          that would thrive in your space. These plants are known for their
          air-purifying qualities and easy maintenance requirements.
        </Text>
      </View>

      {/* Show All Plants Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/ShowAll")}
      >
        <Text style={styles.buttonText}>Show all plants</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {selectedPlant && (
              <>
                <Text style={styles.modalTitle}>{selectedPlant.name}</Text>

                <View style={styles.graphContainer}>
                  <Text style={styles.graphTitle}>Weekly Moisture Levels</Text>
                  <MoistureGraph data={selectedPlant.moistureData} />
                </View>

                <ScrollView>
                  <Text style={styles.infoTitle}>
                    Current Moisture Status: {selectedPlant.currentStatus}
                  </Text>
                  <View style={styles.plantInfoContainer}>
                    <Text style={styles.infoTitle}>About this Plant</Text>
                    <Text style={styles.infoText}>{selectedPlant.info}</Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  circleText: {
    fontSize: 12,
    color: "#333",
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#333",
  },
  graphContainer: {
    marginVertical: 20,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  plantInfoContainer: {
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },
});
