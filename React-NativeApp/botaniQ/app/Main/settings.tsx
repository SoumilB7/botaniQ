import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Image } from "expo-image";
import { blurhash } from '../constants';

export default function Page() {
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('johndoe@example.com');
    const [wifiSSID, setWifiSSID] = useState('MyWiFi');
    const [wifiPassword, setWifiPassword] = useState('password123');

    const handleSave = () => {
        // Implement saving logic (e.g., store in AsyncStorage, send to server)
        console.log('Saved:', { name, email, wifiSSID, wifiPassword });
    };

    return (
        <View style={styles.pageContainer}>
            <Text style={styles.heading}>Settings</Text>
            <Text style={styles.description}>
                The sensor needs WiFi connection to send accurate data to you.
            </Text>
            <View style={{width: 300}}>
                <Text style={styles.label}>Name</Text>
            </View>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />
                      <View style={{width: 300}}>
                <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
            />
                      <View style={{width: 300}}>
                <Text style={styles.label}>Wifi SSID (wifi name)</Text>
            </View>
            <TextInput
                style={styles.input}
                value={wifiSSID}
                onChangeText={setWifiSSID}
                placeholder="Enter WiFi SSID"
            />
                      <View style={{width: 300}}>
                <Text style={styles.label}>Wifi Password</Text>
            </View>
            <TextInput
                style={styles.input}
                value={wifiPassword}
                onChangeText={setWifiPassword}
                placeholder="Enter WiFi Password"
                secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
                  <Image
                    style={styles.image}
                    source={require("../../assets/images/leavesDown.png")}
                    placeholder={{ blurhash }}
                    contentFit="contain"
                    transition={1000}
                  />
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e6e9',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        color: 'gray',
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 15,
        backgroundColor: '#6e9277',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    image: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 50,
      },
});
