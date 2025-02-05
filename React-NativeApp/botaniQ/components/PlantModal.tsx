import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

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

interface PlantModalProps {
  plant: Plant | null;
  visible: boolean;
  onClose: () => void;
}

const PlantModal: React.FC<PlantModalProps> = ({ plant, visible, onClose }) => {
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {plant && (
            <>
              <Text style={styles.modalTitle}>{plant.name}</Text>
              <ScrollView>
                <View style={styles.graphContainer}>
                  <Text style={styles.graphTitle}>Weekly Moisture Levels</Text>
                  <MoistureGraph data={plant.moistureData} />
                </View>

                <Text style={styles.infoTitle}>
                  Current Moisture Status: {plant.status}
                </Text>
                <View style={styles.plantInfoContainer}>
                  <Text style={styles.infoTitle}>About this Plant</Text>
                  <Text style={styles.infoText}>{plant.description}</Text>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default PlantModal;
