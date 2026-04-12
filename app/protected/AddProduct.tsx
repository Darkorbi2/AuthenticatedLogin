import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useMemo, useState } from "react";
import {
  Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import * as Yup from "yup";
import { Category } from "./CategoryListItem";
import { Product } from "./ProductListItem";

const productSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  quantity: Yup.number()
    .typeError("Quantity must be a number")
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  category: Yup.string().required("Category is required"),
  subCategory: Yup.string().required("Subcategory is required"),
});

type ProductFormProps = {
  onAddProduct: (product: Product) => void;
  categories: Category[];
};

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  touched?: boolean;
  error?: string;
  onSelect: (value: string) => void;
};

function SelectField({
  label,
  value,
  placeholder,
  options,
  touched,
  error,
  onSelect,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={[
          styles.selectButton,
          touched && error ? styles.inputError : null,
        ]}
      >
        <Text
          style={value ? styles.selectValueText : styles.selectPlaceholderText}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#64748B" />
      </Pressable>

      {touched && error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setOpen(false)}
          />

          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{label}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.modalListContent}
              ListEmptyComponent={
                <Text style={styles.emptyOptionText}>No options available</Text>
              }
              renderItem={({ item }) => {
                const isSelected = item === value;

                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              }}
            />

            <Pressable
              onPress={() => setOpen(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function AddProduct({
  onAddProduct,
  categories,
}: ProductFormProps) {
  const mainCategories = useMemo(
    () => categories.filter((category) => !category.isSubCategory),
    [categories],
  );

  const mainCategoryNames = useMemo(
    () => mainCategories.map((category) => category.name),
    [mainCategories],
  );

  const resolveSelectedCategoryId = (categoryName: string) => {
    const selected = mainCategories.find(
      (category) => category.name === categoryName,
    );
    return selected?.id;
  };

  return (
    <Formik
      initialValues={{
        name: "",
        quantity: "",
        category: "",
        subCategory: "",
      }}
      validationSchema={productSchema}
      onSubmit={(values, { resetForm }) => {
        const newProduct: Product = {
          id: Date.now().toString(),
          name: values.name.trim(),
          quantity: Number(values.quantity),
          category: values.category,
          subCategory: values.subCategory,
        };

        onAddProduct(newProduct);
        Alert.alert("Success", "Product added successfully");
        
        resetForm();
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldTouched,
        setFieldValue,
      }) => (
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Add new Product</Text>

          <Text style={styles.sectionTitle}>General information</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              placeholder="Enter Name"
              placeholderTextColor={colors.placeholder}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              style={[
                styles.input,
                touched.name && errors.name ? styles.inputError : null,
              ]}
            />
            {errors.name && touched.name ? (
              <Text style={styles.errorText}>Error: {errors.name}</Text>
            ) : null}
          </View>

          <SelectField
            label="Category"
            value={values.category}
            placeholder={
              mainCategoryNames.length
                ? "Select category"
                : "No categories available"
            }
            options={mainCategoryNames}
            touched={Boolean(touched.category)}
            error={errors.category}
            onSelect={(nextValue) => {
              setFieldValue("category", nextValue);
              setFieldValue("subCategory", "");
              setFieldTouched("category", true);
            }}
          />

          {(() => {
            const selectedCategoryId = resolveSelectedCategoryId(
              values.category,
            );
            const filteredSubCategories = categories
              .filter((category) => category.isSubCategory)
              .filter(
                (category) => category.parentCategoryId === selectedCategoryId,
              )
              .map((category) => category.name);

            return (
              <SelectField
                label="Subcategory"
                value={values.subCategory}
                placeholder={
                  values.category
                    ? filteredSubCategories.length
                      ? "Select subcategory"
                      : "No linked subcategories"
                    : "Select category first"
                }
                options={filteredSubCategories}
                touched={Boolean(touched.subCategory)}
                error={errors.subCategory}
                onSelect={(nextValue) => {
                  setFieldValue("subCategory", nextValue);
                  setFieldTouched("subCategory", true);
                }}
              />
            );
          })()}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              placeholder="0"
              placeholderTextColor={colors.placeholder}
              onChangeText={handleChange("quantity")}
              onBlur={handleBlur("quantity")}
              value={values.quantity}
              style={[
                styles.input,
                touched.quantity && errors.quantity ? styles.inputError : null,
              ]}
              keyboardType="number-pad"
            />
            {errors.quantity && touched.quantity ? (
              <Text style={styles.errorText}>Error: {errors.quantity}</Text>
            ) : null}
          </View>

          <View style={styles.submitButton}>
            <Pressable
              onPress={() => handleSubmit()}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Create Product</Text>
            </Pressable>
          </View>

          <View style={[styles.submitButton, { marginTop: 8 }]}>
            <Pressable
              onPress={() => resetForm()}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
          </View>
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
  modalBackdrop: "rgba(0,0,0,0.36)",
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

  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1.08,
    borderWidth: 1,
    borderColor: "#BFC3CC",
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    overflow: "hidden",
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

  selectButton: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  selectValueText: {
    fontSize: 16,
    color: colors.textMain,
    fontWeight: "500",
  },

  selectPlaceholderText: {
    fontSize: 16,
    color: colors.placeholder,
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

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.modalBackdrop,
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    maxHeight: "65%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  modalListContent: {
    paddingBottom: 8,
  },

  optionButton: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },

  optionButtonActive: {
    borderColor: "#A7D88D",
    backgroundColor: "#F2FAED",
  },

  optionText: {
    fontSize: 16,
    color: "#1F2937",
  },

  optionTextActive: {
    fontWeight: "600",
  },

  emptyOptionText: {
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 12,
  },

  modalCloseButton: {
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },

  modalCloseText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
});
