import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        if (photo) {
          setCapturedImage(photo.uri);
        } else {
          console.error("Error taking picture: photo is undefined");
          Alert.alert("Error", "Failed to take picture");
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const payload = JSON.stringify({
        image: base64Image,
      });

      setLoading(true);
      const response = await axios.post(
        "https://6011-2409-40f4-a8-8015-4dca-3a07-def9-4571.ngrok-free.app/image-classify/",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setLoading(false);
      Alert.alert(`Prediction: ${response.data["Predicted-class"]}`);
      setClassification(response.data["Predicted-class"]);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCapturedImage(null)}
            >
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => uploadImage(capturedImage)}
            >
              <Text style={styles.text2}>Upload</Text>
            </TouchableOpacity>
            {loading ? (
              <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#6e9277" />
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.buttonContainer2}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse-outline" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <Ionicons name="ellipse-outline" size={60} color="grey" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
    justifyContent: "space-around",
  },
  buttonContainer2: {
    marginTop: 500,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 20,
    justifyContent: "space-around",
  },
  button: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  },
  button2: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 10,
  },
  captureButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 50,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  text2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});
