import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import * as Yup from "yup";
import { auth } from "../../config/firebase";

const ResetSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordScreen() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Forgot Password</Text>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={ResetSchema}
              onSubmit={async (values) => {
                try {
                  setSubmitting(true);
                  await sendPasswordResetEmail(auth, values.email);
                  Alert.alert(
                    "Reset Link Sent",
                    "Check your email for the password reset link.",
                  );
                } catch (error: any) {
                  let message = "Unable to send reset link. Please try again.";

                  switch (error?.code) {
                    case "auth/invalid-email":
                      message = "That email is invalid.";
                      break;
                    case "auth/user-not-found":
                      message = "No account exists for that email.";
                      break;
                  }

                  Alert.alert("Reset Error", message);
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
              }) => (
                <View>
                  <View style={styles.fieldGroup}>
                    <View
                      style={[
                        styles.inputShell,
                        touched.email && errors.email
                          ? styles.inputShellError
                          : null,
                      ]}
                    >
                      <Ionicons name="mail-outline" size={18} color="#6B7280" />
                      <TextInput
                        placeholder="Enter email"
                        placeholderTextColor={colors.placeholder}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    {errors.email && touched.email ? (
                      <Text style={styles.error}>{errors.email}</Text>
                    ) : null}
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    disabled={submitting}
                    onPress={() => handleSubmit()}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && !submitting && styles.primaryButtonPressed,
                      submitting && styles.primaryButtonDisabled,
                    ]}
                  >
                    <Text style={styles.primaryButtonText}>
                      {submitting ? "Sending..." : "Send Reset Link"}
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={styles.backButton}
                  >
                    <Text style={styles.backButtonText}>Back To Login</Text>
                  </Pressable>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const colors = {
  primary: "#5BAE4A",
  primaryDark: "#3E8A34",
  border: "#D6DEEA",
  borderError: "#EF4444",
  bgInput: "#FFFFFF",
  bgScreen: "#F4F4EF",
  bgPanel: "#FFFFFF",
  textMain: "#1F1F1F",
  textLabel: "#4A4A4A",
  textError: "#C81E1E",
  placeholder: "#8A8F98",
  surfaceBorder: "rgba(31, 31, 31, 0.08)",
  shadow: "rgba(22, 34, 17, 0.12)",
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.bgScreen,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  card: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: colors.bgPanel,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  title: {
    color: colors.textMain,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 36,
    letterSpacing: -0.8,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  inputShellError: {
    borderColor: colors.borderError,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textMain,
    paddingVertical: 0,
  },
  error: {
    color: colors.textError,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },
  primaryButton: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  primaryButtonDisabled: {
    opacity: 0.75,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  backButton: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#5F5F5F",
    fontSize: 14,
    fontWeight: "500",
  },
});
