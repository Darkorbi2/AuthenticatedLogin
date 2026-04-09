import Checkbox from "expo-checkbox";
import { Formik } from "formik";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Yup from "yup";
import { Category } from "./CategoryListItem";

type AddCategoryProps = {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  editingCategory: Category | null;
  clearEditing: () => void;
};

const categorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Category name is required"),
  parentCategoryId: Yup.string().when("isSubCategory", {
    is: true,
    then: (schema) => schema.required("Parent category is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function AddCategory({
  categories,
  onAddCategory,
  onUpdateCategory,
  editingCategory,
  clearEditing,
}: AddCategoryProps) {
  const parentCandidates = categories.filter(
    (category) => !category.isSubCategory,
  );

  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: editingCategory ? editingCategory.name : "",
        isSubCategory: editingCategory
          ? editingCategory.isSubCategory || false
          : false,
        parentCategoryId: editingCategory?.parentCategoryId || "",
      }}
      validationSchema={categorySchema}
      onSubmit={(values, { resetForm }) => {
        const trimmedName = values.name.trim();

        const exists = categories.some(
          (category) =>
            category.name.toLowerCase() === trimmedName.toLowerCase() &&
            category.id !== editingCategory?.id,
        );

        if (exists) {
          Alert.alert("Error", "Category already exists");
          return;
        }

        if (editingCategory) {
          onUpdateCategory({
            ...editingCategory,
            name: trimmedName,
            isSubCategory: values.isSubCategory,
            parentCategoryId: values.isSubCategory
              ? values.parentCategoryId
              : undefined,
          });
          Alert.alert("Success", "Category updated successfully");
          clearEditing();
        } else {
          const newCategory: Category = {
            id: Date.now().toString(),
            name: trimmedName,
            isSubCategory: values.isSubCategory,
            parentCategoryId: values.isSubCategory
              ? values.parentCategoryId
              : undefined,
          };
          onAddCategory(newCategory);
          Alert.alert("Success", "Category added successfully");
        }

        resetForm();
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        resetForm,
        setFieldValue,
      }) => (
        <View style={styles.formContainer}>
          <Text style={styles.heading}>
            {editingCategory ? "Edit Category" : "Add Category"}
          </Text>

          <Text style={styles.sectionTitle}>General information</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              placeholder="Enter category name"
              placeholderTextColor={colors.placeholder}
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              style={[
                styles.input,
                touched.name && errors.name ? styles.inputError : null,
              ]}
            />
            {touched.name && errors.name ? (
              <Text style={styles.errorText}>Error: {errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category Type</Text>

            <Pressable
              style={styles.checkboxCard}
              onPress={() => {
                const nextValue = !values.isSubCategory;
                setFieldValue("isSubCategory", nextValue);

                if (!nextValue) {
                  setFieldValue("parentCategoryId", "");
                }
              }}
            >
              <View style={styles.checkboxLeft}>
                <Checkbox
                  value={values.isSubCategory}
                  onValueChange={(value: any) => {
                    setFieldValue("isSubCategory", value);

                    if (!value) {
                      setFieldValue("parentCategoryId", "");
                    }
                  }}
                  color={values.isSubCategory ? colors.primary : undefined}
                />
                <Text style={styles.checkboxLabel}>Is Subcategory</Text>
              </View>

              <Text style={styles.checkboxHint}>
                {values.isSubCategory ? "Yes" : "No"}
              </Text>
            </Pressable>
          </View>

          {values.isSubCategory && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Parent Category</Text>

              <View style={styles.parentListCard}>
                {parentCandidates.length === 0 ? (
                  <Text style={styles.emptyText}>Add a main category first.</Text>
                ) : (
                  <ScrollView
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.parentListWrap}
                  >
                    {parentCandidates.map((parent) => {
                      const selected = values.parentCategoryId === parent.id;

                      return (
                        <Pressable
                          key={parent.id}
                          onPress={() =>
                            setFieldValue("parentCategoryId", parent.id)
                          }
                          style={[
                            styles.parentPill,
                            selected ? styles.parentPillSelected : null,
                          ]}
                        >
                          <Text
                            style={[
                              styles.parentPillText,
                              selected ? styles.parentPillTextSelected : null,
                            ]}
                          >
                            {parent.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                )}
              </View>

              {touched.parentCategoryId && errors.parentCategoryId ? (
                <Text style={styles.errorText}>
                  Error: {errors.parentCategoryId}
                </Text>
              ) : null}
            </View>
          )}

          <View style={styles.submitButton}>
            <Pressable
              onPress={() => handleSubmit()}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                {editingCategory ? "Update Category" : "Add Category"}
              </Text>
            </Pressable>
          </View>

          {editingCategory && (
            <View style={[styles.submitButton, { marginTop: 8 }]}>
              <Pressable
                onPress={() => {
                  clearEditing();
                  resetForm();
                }}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Cancel Edit</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </Formik>
  );
}

const colors = {
  primary: "#66BB43",
  border: "#E3E7EF",
  borderError: "#EF4444",
  bgInput: "#FFFFFF",
  bgError: "#FEF2F2",
  textMain: "#111827",
  textError: "#DC2626",
  placeholder: "#9CA3AF",
  cardShadow: "rgba(0,0,0,0.16)",
};

const styles = StyleSheet.create({
  formContainer: {
    margin: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },

  heading: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.6,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  fieldGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textMain,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  inputError: {
    borderColor: colors.borderError,
    backgroundColor: colors.bgError,
  },

  errorText: {
    marginTop: 5,
    fontSize: 12,
    color: colors.textError,
    fontWeight: "500",
  },

  checkboxCard: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  checkboxLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    color: colors.textMain,
  },

  checkboxHint: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  parentListCard: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.bgInput,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  parentListWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  parentPill: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  parentPillSelected: {
    borderColor: "#A7D88D",
    backgroundColor: "#F2FAED",
  },

  parentPillText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },

  parentPillTextSelected: {
    color: "#365314",
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 8,
  },

  submitButton: {
    marginTop: 14,
    borderRadius: 14,
    overflow: "hidden",
  },

  primaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
  },

  secondaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#C5C5C5",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
  },
});