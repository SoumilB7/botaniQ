import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Page() {
    return (
        <View style={styles.pageContainer}>
            <Text style={styles.text}>Login</Text>
            <TouchableOpacity style={styles.button} onPress={()=>router.push('/Login')}>
                <Text style={styles.text}>Go to login</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
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