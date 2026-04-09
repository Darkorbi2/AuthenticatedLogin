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

      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>Quantity</Text>
        <Text style={styles.infoValue}>{product.quantity}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>Category</Text>
        <Text style={styles.infoValue}>{product.category}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>Subcategory</Text>
        <Text style={styles.infoValue}>{product.subCategory}</Text>
      </View>
    </View>
  );
}

const colors = {
  border: "#E3E7EF",
  textMain: "#111827",
  textMuted: "#6B7280",
  cardShadow: "rgba(0,0,0,0.16)",
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textMain,
    marginBottom: 14,
  },

  infoBlock: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 15,
    color: colors.textMain,
    fontWeight: "500",
  },
});