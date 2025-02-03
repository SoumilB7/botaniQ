import { router } from "expo-router";
import React, { useState } from "react";
import PlantModal from "../../components/PlantModal";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from "react-native";

import { blurhash } from "@/app/constants";
import { Image as ExpoImage } from "expo-image";

interface Plant {
  id: number;
  name: string;
  image: string;
  info: string;
  moistureData: number[];
  currentStatus: "low" | "medium" | "ok";
}

export default function ShowAllPlants() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [plants, setPlants] = useState<Plant[]>([
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
  ]);

  // Reuse status color function from home page
  const getStatusColor = (status: "low" | "medium" | "ok") => {
    switch (status) {
      case "ok":
        return "#4CAF50";
      case "medium":
        return "#FFC107";
      case "low":
        return "#FF5252";
      default:
        return "#4CAF50";
    }
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const PlantCard = ({ plant }: { plant: Plant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedPlant(plant);
        setModalVisible(true);
      }}
    >
      <ExpoImage
        style={styles.cardImage}
        source={{ uri: plant.image }}
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.cardTextContainer}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.moistureText}>Moisture Level</Text>
      </View>
      <View
        style={[
          styles.statusCircle,
          { borderColor: getStatusColor(plant.currentStatus) },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search plants..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={filteredPlants}
        renderItem={({ item }) => <PlantCard plant={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <PlantModal
        plant={selectedPlant}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e6e9",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
  },
  searchBar: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  moistureText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    marginLeft: 8,
  },
});
