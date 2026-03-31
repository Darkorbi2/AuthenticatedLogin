import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { auth } from "../../config/firebase";

const SignupSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .min(8, "Password must be at least 8 characters")
    .required("Confirm password is required"),
});

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (
    fullName: string,
    email: string,
    password: string,
    resetForm: () => void,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    try {
      setSubmitting(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      resetForm();
      router.replace("/(tabs)/protected/product");
    } catch (error: any) {
      let message = "An unknown error occurred. Please try again.";
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            message = "This email is already in use.";
            break;
          case "auth/invalid-email":
            message = "That email is invalid.";
            break;
          case "auth/weak-password":
            message =
              "Password is too weak. Please choose a stronger password.";
            break;
          default:
            message = error.message || message;
        }
      }
      Alert.alert("Sign Up Error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await handleSignUp(
          values.fullName,
          values.email,
          values.password,
          resetForm,
          setSubmitting,
        );
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
      }) => (
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <TextInput
              placeholder="Full Name"
              onChangeText={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              value={values.fullName}
              style={[
                styles.input,
                touched.fullName && errors.fullName && styles.inputError,
              ]}
            />
            {errors.fullName && touched.fullName && (
              <Text style={styles.error}>{errors.fullName}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <TextInput
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={[
                styles.input,
                touched.email && errors.email && styles.inputError,
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <TextInput
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              style={[
                styles.input,
                touched.password && errors.password && styles.inputError,
              ]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <TextInput
              placeholder="Confirm Password"
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              style={[
                styles.input,
                touched.confirmPassword &&
                  errors.confirmPassword &&
                  styles.inputError,
              ]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}
          </View>

          <Button
            title={showPassword ? "Hide Password" : "Show Password"}
            onPress={() => setShowPassword((prev) => !prev)}
            color="#6B7280"
          />

          <View style={styles.submitButton}>
            <Button onPress={() => handleSubmit()} title="Submit" />
          </View>

          <View style={styles.resetButton}>
            <Button onPress={() => resetForm()} title="Reset" color="red" />
          </View>

          <View style={styles.submitButton}>
            <Text style={styles.signupText}>Already Registered? </Text>
            <Button
              title="Sign In"
              onPress={() => router.push("/(tabs)/sign-in")}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default function HomeScreen() {
  return (
    <View style={styles.bg}>
      <SignupForm />
    </View>
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

  error: {
    color: colors.textError,
    fontSize: 14,
  },

  submitButton: {
    marginTop: 8,
    borderRadius: 10,
    overflow: "hidden",
  },

  resetButton: {
    marginTop: 8,
    borderRadius: 10,
    overflow: "hidden",
  },

  signupText: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textLabel,
  },
});
