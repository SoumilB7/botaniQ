import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        if (photo) {
          setCapturedImage(photo.uri);
        } else {
          console.error('Error taking picture: photo is undefined');
          Alert.alert('Error', 'Failed to take picture');
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      // Create FormData to send the image
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      // Replace with your actual backend URL
      const response = await axios.post('https://kairosmobiltest.pockethost.io/api/collections/image/records', formData, {
        headers: {
            'Authorization': 'pockethost-4f2f7b7b-3b8b-4b8b-3b8b-4b8b4b8b8b8b',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
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
          </View>
        </View>
      ) : (
        <CameraView 
          style={styles.camera} 
          facing={facing}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={takePicture}
            >
              <Text style={styles.text}>Capture</Text>
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
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
    justifyContent: 'space-around',
  },
  button: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  button2: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
  },
  captureButton: {
    padding: 20,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  text2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});