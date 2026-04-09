import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  Image,
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
        email: "",
        password: "",
      }}
      validationSchema={SigninSchema}
      onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
        try {
          // Attempt to sign in with Firebase Auth
          await signInWithEmailAndPassword(auth, values.email, values.password);
          // On success, navigate to employee tab
          resetForm();
          router.replace("/protected/ProductScreen");
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
      }) => (
        <View style={styles.formCard}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username or Email</Text>
            <View
              style={[
                styles.inputShell,
                touched.email && errors.email ? styles.inputShellError : null,
              ]}
            >
              <Ionicons name="mail-outline" size={18} color="#6B7280" />
              <TextInput
                placeholder="Enter username/email"
                placeholderTextColor={colors.placeholder}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                returnKeyType="next"
              />
            </View>
            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputShell,
                touched.password && errors.password
                  ? styles.inputShellError
                  : null,
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
              <TextInput
                placeholder="Enter Password"
                placeholderTextColor={colors.placeholder}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                style={styles.input}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                returnKeyType="done"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.iconButton}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#6B7280"
                />
              </Pressable>
            </View>
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => handleSubmit()}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/(tabs)/forgot-password")}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotButtonText}>Forgot Password?</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.backgroundGlowTop} />
          <View style={styles.backgroundGlowBottom} />

          <View style={styles.screenContent}>
            <View style={styles.brandBlock}>
              <Text style={styles.brandTitle}>Sanjha Punjab</Text>
              <Text style={styles.brandSubtitle}>
                Inventory & Order Management
              </Text>
            </View>

            <View style={styles.heroCard}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
                }}
                resizeMode="cover"
                style={styles.heroImage}
              />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroBadge}>Fresh produce</Text>
                <Text style={styles.heroCaption}>
                  Track stock, orders, and categories from one place.
                </Text>
              </View>
            </View>

            <SigninForm />
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

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 28,
    justifyContent: "center",
  },

  backgroundGlowTop: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(91, 174, 74, 0.12)",
  },

  backgroundGlowBottom: {
    position: "absolute",
    bottom: 40,
    left: -110,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255, 180, 64, 0.10)",
  },

  screenContent: {
    gap: 18,
  },

  brandBlock: {
    alignItems: "center",
    paddingTop: 8,
  },

  brandTitle: {
    color: colors.textMain,
    fontSize: 44,
    fontWeight: "800",
    letterSpacing: -1.2,
    textAlign: "center",
  },

  brandSubtitle: {
    marginTop: 8,
    color: colors.textMain,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    textAlign: "center",
  },

  heroCard: {
    width: "100%",
    minHeight: 210,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.bgPanel,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },

  heroImage: {
    width: "100%",
    height: 210,
  },

  heroOverlay: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.36)",
  },

  heroBadge: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  heroCaption: {
    marginTop: 6,
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },

  formCard: {
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

  fieldGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textLabel,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
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

  iconButton: {
    padding: 4,
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

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  forgotButton: {
    marginTop: 14,
    alignItems: "center",
  },

  forgotButtonText: {
    color: "#5F5F5F",
    fontSize: 14,
    fontWeight: "500",
  },
});
