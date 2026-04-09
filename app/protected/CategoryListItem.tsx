import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type Category = {
  id: string;
  name: string;
  isSubCategory?: boolean;
  parentCategoryId?: string;
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

      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {category.isSubCategory ? "Subcategory" : "Main Category"}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.editButton} onPress={() => onEdit(category)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(category.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const colors = {
  primary: "#66BB43",
  border: "#E3E7EF",
  textMain: "#111827",
  textMuted: "#6B7280",
  cardShadow: "rgba(0,0,0,0.16)",
  delete: "#EF4444",
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
    marginBottom: 10,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#F2FAED",
    borderWidth: 1,
    borderColor: "#A7D88D",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },

  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#365314",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  editButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
  },

  deleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.delete,
  },
});