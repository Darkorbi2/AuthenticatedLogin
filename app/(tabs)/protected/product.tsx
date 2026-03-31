import { signOut } from "firebase/auth";
import { Formik } from "formik";
import React from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { auth } from "../../../config/firebase";

const productSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  quantity: Yup.number().required("Quantity is required"),
  category: Yup.string().required("Category is required"),
  subCategory: Yup.string().required("subcategory is required"),
});

const MyForm = () => (
  <Formik
    validateOnMount={false}
    validateOnBlur={true}
    initialValues={{
      name: "",
      quantity: "",
      category: "",
      subCategory: "",
    }}
    validationSchema={productSchema}
    onSubmit={(values) =>
      Alert.alert(
        `Name: ${values.name}\nQuantity: ${values.quantity}`,
        `Category: ${values.category}\nSubcategory: ${values.subCategory}`,
      )
    }
  >
    {({
      handleChange,
      handleBlur,
      handleSubmit,
      resetForm,
      values,
      errors,
      touched,
    }) => (
      <View style={styles.formContainer}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Product Name</Text>
          <TextInput
            placeholder="Name of product"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            value={values.name}
            style={[
              styles.input,
              touched.name && errors.name && styles.inputError,
            ]}
          />
          {errors.name && touched.name ? (
            <Text style={styles.errorText}>⚠️ {errors.name}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            placeholder="Number of the product"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("quantity")}
            onBlur={handleBlur("quantity")}
            value={values.quantity}
            style={[
              styles.input,
              touched.quantity && errors.quantity && styles.inputError,
            ]}
            keyboardType="number-pad"
          />
          {errors.quantity && touched.quantity ? (
            <Text style={styles.errorText}>⚠️ {errors.quantity}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            placeholder="Category of your product i.e Fruit"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("category")}
            onBlur={handleBlur("category")}
            value={values.category}
            autoCapitalize="none"
            style={[
              styles.input,
              touched.category && errors.category && styles.inputError,
            ]}
          />
          {errors.category && touched.category ? (
            <Text style={styles.errorText}>⚠️ {errors.category}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>subcategory</Text>
          <TextInput
            placeholder="Subcategory of your product i.e melon"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("subCategory")}
            onBlur={handleBlur("subCategory")}
            value={values.subCategory}
            style={[
              styles.input,
              touched.subCategory && errors.subCategory && styles.inputError,
            ]}
          />
          {errors.subCategory && touched.subCategory ? (
            <Text style={styles.errorText}>⚠️ {errors.subCategory}</Text>
          ) : null}
        </View>

        <View style={styles.submitButton}>
          <Button
            onPress={() => handleSubmit()}
            title="Submit Product"
            color={colors.primary}
          />
        </View>

        <View style={[styles.submitButton, { marginTop: 8 }]}>
          <Button
            onPress={() => resetForm()}
            title="Reset Form"
            color="#6B7280"
          />
        </View>
      </View>
    )}
  </Formik>
);

export default function ProductScreen() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Sign Out Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.bg}>
      <View style={{ padding: 20 }}>
        <Button title="Sign Out" onPress={handleSignOut} color="#EF4444" />
      </View>
      <MyForm />
    </SafeAreaView>
  );
}

const colors = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  border: "#D1D5DB",
  borderFocus: "#2563EB",
  borderError: "#EF4444",
  bgInput: "#FFFFFF",
  bgError: "#FEF2F2",
  textMain: "#111827",
  textLabel: "#374151",
  textError: "#DC2626",
  placeholder: "#9CA3AF",
  bgScreen: "#F9FAFB",
};

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors.bgScreen,
    flex: 1,
  },

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

  fieldGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textLabel,
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.textMain,
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
    marginTop: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
});
