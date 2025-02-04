import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Slot } from "expo-router";

import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider } from "@/AuthContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <Stack
      screenOptions={{
        headerShown: false,
      }}
      >
        <Slot />
        {/* <Stack.Screen
          name="index"
          options={
            {
              // Add any specific options for index screen
            }
          }
          />
        <Stack.Screen
          name="Login"
          options={
            
            {
              // Add any specific options for Logout screen
            }
          }
          />
        <Stack.Screen
          name="Main"
          options={
            {
              // Add any specific options for Logout screen
            }
          }
          />
        <Stack.Screen
          name="ShowAll"
          options={
            {
              // Add any specific options for Logout screen
            }
          }
          />
        <Stack.Screen
          name="Signup"
          options={
            {
              // Add any specific options for Logout screen
            }
          }
          /> */}
      </Stack>
          </AuthProvider>
  );
}
