import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export type Category = {
  id: string;
  name: string;
};

type CategoryListItemProps = {
  category: Category;
  onDelete: (id: string) => void;
  onEdit: (category: Category) => void;
};

export default function CategoryListItem({
  category,
  onDelete,
  onEdit,
}: CategoryListItemProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{category.name}</Text>

      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button title="Edit" onPress={() => onEdit(category)} />
        </View>
        <View style={styles.button}>
          <Button title="Delete" color="#EF4444" onPress={() => onDelete(category.id)} />
        </View>
      </View>
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
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
  },
});