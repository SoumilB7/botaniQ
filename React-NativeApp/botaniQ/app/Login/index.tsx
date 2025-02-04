import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { backend } from '../constants'; // Ensure this contains your API URL

interface Login {
  email: string;
  password: string;
}


const handleLogin = async (user: Login) => {
  try {
    const response = await fetch(`${backend}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      router.push('/Main'); // Redirect on success
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred');
  }
};

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.headerText}>Welcome Back</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#666"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput 
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
          onChangeText={setPassword}
          value={password}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleLogin({ email, password })}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.signUp}
        onPress={() => router.push('/Signup')}
      >
        <Text style={styles.signUpButtonText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signUp: {
    marginTop: 15,
  },
  signUpButtonText: {
    color: '#6e9277',
    fontSize: 14,
  },
});

