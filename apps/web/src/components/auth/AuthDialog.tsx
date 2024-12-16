"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSlice } from "@/store/slices/useAuthSlice";
import { GoogleLogin } from "@react-oauth/google";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login, signup, resetPassword, isLoading, error, loginWithGoogle } = useAuthSlice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup" && password !== confirmPassword) {
      return;
    }

    try {
      switch (mode) {
        case "login":
          await login(email, password);
          if (!error) {
            onClose();
            router.push("/dashboard");
          }
          break;
        case "signup":
          await signup(email, password);
          if (!error) {
            onClose();
            router.push("/dashboard");
          }
          break;
        case "reset":
          await resetPassword(email);
          if (!error) {
            onClose();
          }
          break;
      }
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      await loginWithGoogle(credential);
      if (!error) {
        onClose();
        router.push("/dashboard");
      }
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        {mode === "login" && "Sign In"}
        {mode === "signup" && "Create Account"}
        {mode === "reset" && "Reset Password"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoFocus
              disabled={isLoading}
            />

            {mode !== "reset" && (
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                disabled={isLoading}
              />
            )}

            {mode === "signup" && (
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                disabled={isLoading}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign In"
                  : mode === "signup"
                    ? "Create Account"
                    : "Reset Password"}
            </Button>

            <Stack direction="row" spacing={1} justifyContent="center">
              {mode === "login" && (
                <>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => !isLoading && handleModeChange("signup")}
                    sx={{ pointerEvents: isLoading ? "none" : "auto" }}
                  >
                    Create account
                  </Link>
                  <Typography variant="body2">•</Typography>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => !isLoading && handleModeChange("reset")}
                    sx={{ pointerEvents: isLoading ? "none" : "auto" }}
                  >
                    Forgot password?
                  </Link>
                </>
              )}
              {mode !== "login" && (
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => !isLoading && handleModeChange("login")}
                  sx={{ pointerEvents: isLoading ? "none" : "auto" }}
                >
                  Back to sign in
                </Link>
              )}
            </Stack>
          </Stack>
        </form>

        <div className="mt-4 w-full flex items-center justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse.credential ?? "");
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
