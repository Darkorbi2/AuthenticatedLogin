import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../config/firebase";
import AddCategory from "../AddCategory";
import CategoryListItem, { Category } from "../CategoryListItem";

const ADMIN_EMAIL = "admin@test.com";
const CATEGORY_STORAGE_KEY = "categories";

export default function CategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem(CATEGORY_STORAGE_KEY);

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load categories");
    }
  };

  const saveCategories = async (updatedCategories: Category[]) => {
    try {
      await AsyncStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(updatedCategories),
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save categories");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Sign Out Error", "Failed to sign out. Please try again.");
    }
  };

  const addCategory = async (newCategory: Category) => {
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const updateCategory = async (updatedCategory: Category) => {
    const updatedCategories = categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category,
    );

    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedCategories = categories.filter(
              (category) => category.id !== id,
            );
            setCategories(updatedCategories);
            await saveCategories(updatedCategories);
          },
        },
      ],
    );
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.bg}>
        <View style={styles.center}>
          <View style={styles.deniedCard}>
            <Text style={styles.deniedTitle}>Access Denied</Text>
            <Text style={styles.deniedText}>
              Only admin can manage categories.
            </Text>

            <Pressable onPress={() => router.back()} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.bg}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={styles.topBar}>
              <Text style={styles.topBarTitle}>Categories</Text>
              <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                <Ionicons name="log-out-outline" size={17} color="#DC2626" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
            </View>

            <AddCategory
              categories={categories}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              editingCategory={editingCategory}
              clearEditing={() => setEditingCategory(null)}
            />

            <Text style={styles.listHeader}>Categories</Text>
          </View>
        }
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryListItem
            category={item}
            onDelete={deleteCategory}
            onEdit={setEditingCategory}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No categories added yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const colors = {
  bgScreen: "#F9FAFB",
  textMain: "#111827",
  textMuted: "#6B7280",
  primary: "#66BB43",
  cardShadow: "rgba(0,0,0,0.16)",
};

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors.bgScreen,
    flex: 1,
  },

  topBar: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topBarTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  signOutText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 13,
  },

  listHeader: {
    marginTop: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 10,
    fontSize: 14,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  deniedCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 14,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 3,
  },

  deniedTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },

  deniedText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 18,
    textAlign: "center",
  },

  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },
});