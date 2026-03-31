import { signOut } from "firebase/auth";
import { Formik } from "formik";
import React from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { auth } from "../../../config/firebase";

const SignupSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  DoB: Yup.date()
    .required("Date of birth is required")
    .typeError("Invalid date format, please use YYYY-MM-DD"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{3}-\d{3}-\d{4}$/, "Please put in the format ###-###-####")
    .min(12, "please put in the format ###-###-####")
    .max(12, "please put in the format ###-###-####")
    .required("Please put in the format ###-###-####"),
  jobTitle: Yup.string().required("Job title is required"),
});

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

const MyForm = () => (
  <Formik
    validateOnMount={false}
    validateOnBlur={true}
    initialValues={{
      fullName: "",
      DoB: "",
      email: "",
      phoneNumber: "",
      jobTitle: "",
    }}
    validationSchema={SignupSchema}
    onSubmit={(values) =>
      Alert.alert(
        `Name: ${values.fullName}\nDoB: ${values.DoB}`,
        `Email: ${values.email}\nPhone: ${values.phoneNumber}\nTitle: ${values.jobTitle}`,
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
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            value={values.fullName}
            autoCapitalize="words"
            style={[
              styles.input,
              touched.fullName && errors.fullName && styles.inputError,
            ]}
          />
          {errors.fullName && touched.fullName ? (
            <Text style={styles.errorText}>⚠️ {errors.fullName}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("DoB")}
            onBlur={handleBlur("DoB")}
            value={values.DoB}
            style={[
              styles.input,
              touched.DoB && errors.DoB && styles.inputError,
            ]}
          />
          {errors.DoB && touched.DoB ? (
            <Text style={styles.errorText}>⚠️ {errors.DoB}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            placeholder="e.g yourname@company.com"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            autoCapitalize="none"
            style={[
              styles.input,
              touched.email && errors.email && styles.inputError,
            ]}
          />
          {errors.email && touched.email ? (
            <Text style={styles.errorText}>⚠️ {errors.email}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="###-###-####"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            value={values.phoneNumber}
            style={[
              styles.input,
              touched.phoneNumber && errors.phoneNumber && styles.inputError,
            ]}
          />
          {errors.phoneNumber && touched.phoneNumber ? (
            <Text style={styles.errorText}>⚠️ {errors.phoneNumber}</Text>
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            placeholder="e.g. Software Developer"
            placeholderTextColor={colors.placeholder}
            onChangeText={handleChange("jobTitle")}
            onBlur={handleBlur("jobTitle")}
            value={values.jobTitle}
            style={[
              styles.input,
              touched.jobTitle && errors.jobTitle && styles.inputError,
            ]}
          />
          {errors.jobTitle && touched.jobTitle ? (
            <Text style={styles.errorText}>⚠️ {errors.jobTitle}</Text>
          ) : null}
        </View>

        <View style={styles.submitButton}>
          <Button
            onPress={() => handleSubmit()}
            title="Submit Employee"
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

export default function EmployeeScreen() {
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
