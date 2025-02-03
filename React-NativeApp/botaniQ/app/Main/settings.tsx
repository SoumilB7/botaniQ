import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Page() {
    return (
        <View style={styles.pageContainer}>
            <Text style={styles.text}>settings</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e6e9'
    },
    text: {
        color: 'black',
    },
    button: {
        width: 20,
        height: 20,
        backgroundColor: "green",
        justifyContent: 'center',
        alignItems: 'center',
    }
})