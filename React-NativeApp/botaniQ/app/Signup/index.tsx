import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { backend } from '../constants';
import { useAuth } from '@/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignUp {
  username: string;
  email: string;
  password: string;
  enabled: string;
  authtoken: string;
}
const createUser = async (user: SignUp, setIsAuthenticated: (value: boolean) => void, setUserId: (value: number) => void) => {
  try {
    const response = await fetch(`${backend}/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    
    if (response.status != 201) {
      throw new Error('Signup failed!'+response.status);
    }

    const data = await response.json();
    console.log(data);
    return data; // Return response for further actions if needed
  } catch (error) {
    console.error(error);
  }
};

export default function Page() {
  const { setIsAuthenticated, setUserId } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enabled, setEnabled] = useState('false');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords don't match!");
      return;
    }

    const newUser: SignUp = { username, email, password, enabled, authtoken: '22' };

    const result = await createUser(newUser, setIsAuthenticated, setUserId);
    if (result) {
      setIsAuthenticated(true);
      setUserId(result.userId);
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.setItem('userId', result.userId.toString());
      router.push('/Main/home');
    }
  };

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.headerText}>Create Account</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Username"
          style={styles.input}
          placeholderTextColor="#666"
          onChangeText={setUsername}
        />
        <TextInput 
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#666"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput 
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
          onChangeText={setPassword}
        />
        <TextInput 
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
          onChangeText={setConfirmPassword}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignUp}
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
    shadowOffset: { width: 0, height: 4 },
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
