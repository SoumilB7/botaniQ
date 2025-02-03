import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';

export default function Page() {
  return (
    <View style={styles.pageContainer}>
      <Text style={styles.headerText}>Create Account</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Full Name"
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput 
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput 
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TextInput 
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/Main')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => router.push('/Login')}
      >
        <Text style={styles.loginButtonText}>Already have an account? Log In</Text>
      </TouchableOpacity>
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
  headerText: {
    color: '#2C3E50',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F6F8',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6e9277',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#34D399',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButton: {
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonText: {
    color: '#6e9277',
    fontSize: 14,
  }
});
