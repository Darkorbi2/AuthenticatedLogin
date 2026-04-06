// import { HapticTab } from "@/components/haptic-tab";
// import { Colors } from "@/constants/theme";
// import { useColorScheme } from "@/hooks/use-color-scheme";
// import { Redirect, Tabs } from "expo-router";
// import { onAuthStateChanged, User } from "firebase/auth";
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { auth } from "../../../config/firebase";

// export default function ProtectedLayout() {
//   const colorScheme = useColorScheme();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!user) {
//     return <Redirect href="/(tabs)/sign-in" />;
//   }

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//         tabBarInactiveTintColor: colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
//         tabBarStyle: {
//           backgroundColor: colorScheme === "dark" ? "#111827" : "#FFFFFF",
//           borderTopColor: colorScheme === "dark" ? "#1F2937" : "#E5E7EB",
//         },
//         headerShown: false,
//         tabBarButton: HapticTab,
//       }}
//     ></Tabs>
//   );
// }
