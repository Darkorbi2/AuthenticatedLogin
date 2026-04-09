import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../config/firebase";
import AddProduct from "../AddProduct";
import { Category } from "../CategoryListItem";
import ProductListItem, { Product } from "../ProductListItem";

const PRODUCT_STORAGE_KEY = "products";
const CATEGORY_STORAGE_KEY = "categories";

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState("");

  const loadProducts = async () => {
    try {
      const savedProducts = await AsyncStorage.getItem(PRODUCT_STORAGE_KEY);

      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load products");
    }
  };

  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem(CATEGORY_STORAGE_KEY);

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      } else {
        setCategories([]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load categories");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      loadCategories();
    }, []),
  );

  const saveProducts = async (updatedProducts: Product[]) => {
    try {
      await AsyncStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(updatedProducts),
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save products");
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

  const addProduct = async (newProduct: Product) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    await saveProducts(updatedProducts);
  };

  const filteredProducts = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subCategory.toLowerCase().includes(query)
      );
    });
  }, [products, searchText]);

  return (
    <SafeAreaView style={styles.bg}>
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={styles.topBar}>
              <Text style={styles.topBarTitle}>Inventory</Text>
              <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                <Ionicons name="log-out-outline" size={17} color="#DC2626" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
            </View>

            <AddProduct onAddProduct={addProduct} categories={categories} />

            <View style={styles.searchContainer}>
              <Text style={styles.searchLabel}>Search products</Text>
              <TextInput
                placeholder="Search by name, category, or subcategory..."
                placeholderTextColor={colors.placeholder}
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
              />
            </View>

            <Text style={styles.listHeader}>Products</Text>
          </View>
        }
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductListItem product={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText
              ? "No matching products found."
              : "No products added yet."}
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const colors = {
  border: "#E3E7EF",
  bgInput: "#FFFFFF",
  textMain: "#111827",
  textLabel: "#374151",
  placeholder: "#9CA3AF",
  bgScreen: "#F9FAFB",
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

  searchContainer: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  searchLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textMain,
    marginBottom: 8,
  },

  searchInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textMain,
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
});