import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { auth } from "../../config/firebase";

const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const SigninForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SigninSchema}
      onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
        try {
          // Attempt to sign in with Firebase Auth
          await signInWithEmailAndPassword(auth, values.email, values.password);
          // On success, navigate to employee tab
          resetForm();
          router.replace("/(tabs)/protected/employee");
        } catch (error: any) {
          let message = "An unknown error occurred. Please try again.";
          if (error.code) {
            switch (error.code) {
              case "auth/invalid-email":
                message = "That email is invalid.";
                break;
              case "auth/user-disabled":
                message = "This user account has been disabled.";
                break;
              case "auth/user-not-found":
                message = "No user found with this email.";
                break;
              case "auth/wrong-password":
                message = "The password is incorrect.";
                break;
              case "auth/too-many-requests":
                message = "Too many login attempts. Please try again later.";
                break;
            }
          }
          Alert.alert("Login Error", message);
        } finally {
          setSubmitting(false);
        }
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
          {/* EMAIL */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>

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
            />
            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
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
              keyboardType="default"
              autoCapitalize="none"
            />
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <View style={styles.LoginButton}>
              <Button
                title={showPassword ? "Hide Password" : "Show Password"}
                onPress={() => setShowPassword((prev) => !prev)}
                color="#6B7280"
              />
            </View>
          </View>

          <View style={styles.LoginButton}>
            <Button onPress={() => handleSubmit()} title="Login" />
          </View>

          <View style={styles.registerButton}>
            <Text style={styles.signupText}>Not Registered? </Text>

            <View style={styles.signupButton}>
              <Button
                title="Sign Up"
                onPress={() => router.push("/(tabs)/sign-up")}
              />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default function HomeScreen() {
  return (
    <View style={styles.bg}>
      <SigninForm />
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

  LoginButton: {
    marginTop: 8,
    borderRadius: 10,
    overflow: "hidden",
  },

  error: {
    color: "red",
    fontSize: 14,
  },

  signupButton: { marginTop: 8, borderRadius: 10, overflow: "hidden" },
  registerButton: {},
  signupText: {},
});
