import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type Product = {
  id: string;
  name: string;
  quantity: number;
  category: string;
  subCategory: string;
};

type ProductListItemProps = {
  product: Product;
};

export default function ProductListItem({ product }: ProductListItemProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.info}>Quantity: {product.quantity}</Text>
      <Text style={styles.info}>Category: {product.category}</Text>
      <Text style={styles.info}>Subcategory: {product.subCategory}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
});
