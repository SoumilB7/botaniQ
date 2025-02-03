import { router } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import BotaniQLogoMain from "@/components/BotaniQLogoMain";
import { blurhash } from '@/app/constants';

export default function Page() {
  
  return (
    <View style={styles.pageContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.ImageView}>
          <BotaniQLogoMain />
          <Text style={styles.headerText}>BOTANIQ</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/Login")}
        >
          <Text style={styles.buttonText}>Login</Text>SignUp
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push("/Signup")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Image
        style={styles.image}
        source={require("../assets/images/leavesDown.png")}
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
    justifyContent: "center",
    backgroundColor: "#e0e6e9",
  },
  headerText: {
    color: '#2C3E50',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
  },
  ImageView: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#6e9277",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#34D399",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  signupButton: {
    backgroundColor: "#455c4b",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#34D399",
    fontSize: 14,
  },
});
