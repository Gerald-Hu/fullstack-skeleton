import { LoginSheet } from "@/components/LoginSheet";
import { SignupSheet } from "@/components/SignupSheet";
import { ForgotPasswordSheet } from "@/components/ForgotPasswordSheet";
import { View } from "@components/Themed";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "@/stores";
import { OnboardingScreen } from "@/components/OnboardingScreen";

export function Auth() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const { 
    login, 
    signup, 
    resetPassword,
    hasCompletedOnboarding,
    completeOnboarding,
    checkOnboardingStatus 
  } = useStore();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  function setToLogin() {
    setMode("login");
  }

  function setToSignup() {
    setMode("signup");
  }

  function setToReset() {
    setMode("reset");
  }

  function loginUser(email: string, password: string) {
    login(email, password);
  }

  function signupUser(name: string, email: string, password: string) {
    signup(name, email, password);
  }

  function resetPasswordUser(email: string) {
    resetPassword(email);
  }

  if (Math.random() > 0.5) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  return (
    <View 
      className="justify-center flex-1"
      style={{ 
        paddingTop: insets.top,
        height: '100%'
      }}
    >
      { mode === "login" && <LoginSheet onLogin={loginUser} onSignupPress={() => setToSignup()} onForgotPasswordPress={() => setToReset()} />}
      { mode === "signup" && <SignupSheet onSignup={signupUser} onLoginPress={() => setToLogin()} />}
      { mode === "reset" && <ForgotPasswordSheet onReset={resetPasswordUser} onLoginPress={() => setToLogin()} />}
    </View>
  );
}