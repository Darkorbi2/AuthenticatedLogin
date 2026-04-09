import { router } from "expo-router";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { auth, secondaryAuth } from "../../../config/firebase";

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

    await createUserWithEmailAndPassword(secondaryAuth, email, password);

    await signOut(secondaryAuth);

    resetForm();
    Alert.alert("Success", "Account created successfully!");
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
          message = "Password is too weak. Please choose a stronger password.";
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
          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.sectionTitle}>Sign up details</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="Enter full name"
              placeholderTextColor={colors.placeholder}
              onChangeText={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              value={values.fullName}
              style={[
                styles.input,
                touched.fullName && errors.fullName ? styles.inputError : null,
              ]}
            />
            {errors.fullName && touched.fullName && (
              <Text style={styles.errorText}>Error: {errors.fullName}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter email"
              placeholderTextColor={colors.placeholder}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              style={[
                styles.input,
                touched.email && errors.email ? styles.inputError : null,
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>Error: {errors.email}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter password"
              placeholderTextColor={colors.placeholder}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              style={[
                styles.input,
                touched.password && errors.password ? styles.inputError : null,
              ]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            {errors.password && touched.password && (
              <Text style={styles.errorText}>Error: {errors.password}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor={colors.placeholder}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              style={[
                styles.input,
                touched.confirmPassword && errors.confirmPassword
                  ? styles.inputError
                  : null,
              ]}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <Text style={styles.errorText}>
                Error: {errors.confirmPassword}
              </Text>
            )}
          </View>

          <View style={styles.submitButton}>
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                {showPassword ? "Hide Password" : "Show Password"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.submitButton}>
            <Pressable onPress={() => handleSubmit()} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Submit</Text>
            </Pressable>
          </View>

          <View style={[styles.submitButton, { marginTop: 8 }]}>
            <Pressable onPress={() => resetForm()} style={styles.dangerButton}>
              <Text style={styles.dangerButtonText}>Reset</Text>
            </Pressable>
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
  primary: "#66BB43",
  border: "#E3E7EF",
  borderError: "#EF4444",
  bgInput: "#FFFFFF",
  bgError: "#FEF2F2",
  textMain: "#111827",
  textError: "#DC2626",
  placeholder: "#9CA3AF",
  bgScreen: "#F9FAFB",
  cardShadow: "rgba(0,0,0,0.16)",
};

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors.bgScreen,
    flex: 1,
    justifyContent: "center",
  },

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
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
  },

  dangerButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    alignItems: "center",
    justifyContent: "center",
  },

  dangerButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#DC2626",
  },
});