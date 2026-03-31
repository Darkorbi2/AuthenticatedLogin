import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../../config/firebase";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#111827" : "#FFFFFF",
          borderTopColor: colorScheme === "dark" ? "#1F2937" : "#E5E7EB",
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="sign-in"
        options={{
          title: "Sign-In",
          href: user ? null : undefined,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sign-up"
        options={{
          title: "Sign-Up",
          href: user ? null : undefined,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="protected/employee"
        options={{
          title: "Employee",
          href: !user ? null : undefined,
          tabBarIcon: ({ color }) => (
            <Ionicons name="briefcase" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
