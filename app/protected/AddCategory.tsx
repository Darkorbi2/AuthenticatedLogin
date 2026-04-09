import Checkbox from "expo-checkbox";
import { Formik } from "formik";
import React from "react";
import {
  Alert,
  Button,
  Pressable,
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

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              placeholder="Enter category name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              style={[
                styles.input,
                touched.name && errors.name ? styles.inputError : null,
              ]}
            />
            {touched.name && errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <View style={styles.checkboxRow}>
            <Checkbox
              value={values.isSubCategory}
              onValueChange={(value) => {
                setFieldValue("isSubCategory", value);

                if (!value) {
                  setFieldValue("parentCategoryId", "");
                }
              }}
            />
            <Text style={styles.checkboxLabel}>Is Subcategory</Text>
          </View>

          {values.isSubCategory && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Parent Category</Text>

              <View style={styles.parentListWrap}>
                {parentCandidates.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Add a main category first.
                  </Text>
                ) : (
                  parentCandidates.map((parent) => {
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
                  })
                )}
              </View>

              {touched.parentCategoryId && errors.parentCategoryId ? (
                <Text style={styles.errorText}>{errors.parentCategoryId}</Text>
              ) : null}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={editingCategory ? "Update Category" : "Add Category"}
              onPress={() => handleSubmit()}
            />
          </View>

          {editingCategory && (
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel Edit"
                color="#6B7280"
                onPress={() => {
                  clearEditing();
                  resetForm();
                }}
              />
            </View>
          )}
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    margin: 20,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: "#111827",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    marginTop: 5,
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "500",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: "#111827",
  },
  buttonContainer: {
    marginTop: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  parentListWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  parentPill: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  parentPillSelected: {
    borderColor: "#65A30D",
    backgroundColor: "#ECFCCB",
  },
  parentPillText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
  },
  parentPillTextSelected: {
    color: "#365314",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 13,
  },
});
