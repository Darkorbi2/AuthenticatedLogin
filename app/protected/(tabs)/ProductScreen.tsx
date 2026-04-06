import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../config/firebase";
import ProductListItem, { Product } from "../ProductListItem";
import AddProduct from "./AddProduct";

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/(tabs)/sign-in");
    } catch (error) {
      Alert.alert("Sign Out Error", "Failed to sign out. Please try again.");
    }
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
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
            <View style={styles.signOutContainer}>
              <Button
                title="Sign Out"
                onPress={handleSignOut}
                color="#EF4444"
              />
            </View>

            <AddProduct onAddProduct={addProduct} />
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
  primary: "#2563EB",
  border: "#D1D5DB",
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

  signOutContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  searchContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  searchLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textLabel,
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  searchInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.textMain,
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
});
