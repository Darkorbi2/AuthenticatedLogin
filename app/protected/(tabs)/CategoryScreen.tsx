import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
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
        JSON.stringify(updatedCategories)
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
      category.id === updatedCategory.id ? updatedCategory : category
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
              (category) => category.id !== id
            );
            setCategories(updatedCategories);
            await saveCategories(updatedCategories);
          },
        },
      ]
    );
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.bg}>
        <View style={styles.center}>
          <Text style={styles.deniedText}>
            Access denied. Only admin can manage categories.
          </Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.bg}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={styles.signOutContainer}>
              <Button
                title="Sign Out"
                onPress={handleSignOut}
                color="#EF4444"
              />
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

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#F9FAFB",
    flex: 1,
  },
  signOutContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  listHeader: {
    marginTop: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    fontSize: 20,
    fontWeight: "700",
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
    paddingHorizontal: 24,
  },
  deniedText: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
});