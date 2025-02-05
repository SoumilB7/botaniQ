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
import { backend } from "../constants";
import { useAuth } from "@/AuthContext";

interface UploadResponse {
  id: string;
  // Add other expected response fields here
}

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { userId } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
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
      const formData = new FormData();

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      console.log("File info:", fileInfo);

      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

   

      if (!fileInfo.exists) {
        throw new Error("File does not exist");
      }

      // Create file object - use the correct field name that matches your PocketBase schema
      const fileToUpload = {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      };

      // For PocketBase, the file field should match the schema field name
      formData.append("field", fileToUpload as any); // Assuming 'field' is your image field name in PocketBase
      formData.append("userId", "1");
      formData.append("plantId", "1");

      console.log("Preparing to upload with FormData parts:", formData as any);

      setLoading(true);

      setUploading(true);

      const response = await axios({
        method: "post",
        url: "https://botaniq.pockethost.io/api/collections/image/records",
        data: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", response.data);
      setUploading(false);

      const payload = JSON.stringify({
        userId: userId,
        recordId: response.data.rescordId,
        fileName: response.data.filename,
        image: base64Image,
      });

      setUploading(false);

      setAnalysing(true);

      const response2 = await axios.post(
        `${backend}/app/${userId}/save`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setAnalysing(false);
      setLoading(false);
      console.log(response2.data);
      Alert.alert(
        `Prediction: ${response2.data.name}`,
        response2.data.description
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Request that caused error:", {
          url: error.config?.url,
          headers: error.config?.headers,
          data: error.config?.data,
        });
        console.error("Error response:", error.response?.data);
      }
      console.error("Upload error:", error);
      setLoading(false);
      throw error;
    }
  };

  // const uploadImage = async (imageUri: string) => {
  //   try {
  //     const base64Image = await FileSystem.readAsStringAsync(imageUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     const payload = JSON.stringify({
  //       image: base64Image,
  //     });

  //     setLoading(true);
  //     const response = await axios.post(
  //       "https://3f46-136-233-9-106.ngrok-free.app/image-classify/",
  //       payload,
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     setLoading(false);
  //     console.log(response.data);
  //     Alert.alert(`Prediction: ${response.data.name}`, response.data.description);

  //     // setClassification(String(response.data["name"]));
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     Alert.alert("Error", "Failed to upload image. Please try again.");
  //     setLoading(false);
  //   }
  // };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={[styles.container2, styles.centerContent]}>
          <ActivityIndicator size="large" color="#6e9277" />
          <Text style={{ fontSize: 20, marginTop: 20, color: "#6e9277" , textAlign: "center",  paddingBottom: 10, }}>{uploading ? "Uploading" : "Analysing"}</Text>
          <Text style={styles.message}>This may take a few seconds</Text>
        </View>
      ) : null}
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
  container2: {
    height: 250,
    justifyContent: "center",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#e0e6e9",
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
    marginHorizontal: 20,

    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  },
  button2: {
    marginHorizontal: 20,
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
