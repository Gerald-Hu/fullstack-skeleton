import { LoginSheet } from "@/components/LoginSheet";
import { SignupSheet } from "@/components/SignupSheet";
import { ForgotPasswordSheet } from "@/components/ForgotPasswordSheet";
import { View } from "@components/Themed";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "@/stores";

export function Auth() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const { 
    login, 
    loginWithGoogle,
    signup, 
    resetPassword,
  } = useStore(state => state.auth);

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

  function handleLoginWithGoogle(idToken: string) {
    loginWithGoogle(idToken);
  }

  function signupUser(name: string, email: string, password: string) {
    signup(name, email, password);
  }

  function resetPasswordUser(email: string) {
    resetPassword(email);
  }

  return (
    <View 
      className="justify-center flex-1"
      style={{ 
        paddingTop: insets.top,
        height: '100%',
      }}
    >
      { mode === "login" && <LoginSheet onLoginWithGoogle={handleLoginWithGoogle} onLogin={loginUser} onSignupPress={() => setToSignup()} onForgotPasswordPress={() => setToReset()} />}
      { mode === "signup" && <SignupSheet onSignup={signupUser} onLoginPress={() => setToLogin()} />}
      { mode === "reset" && <ForgotPasswordSheet onReset={resetPasswordUser} onLoginPress={() => setToLogin()} />}
    </View>
  );
}