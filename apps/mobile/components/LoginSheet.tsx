import React, { useState } from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { View, Text } from './Themed';
import { Button } from './Button';
import { useStore } from '@/stores';

interface LoginSheetProps {
  onClose: () => void;
  onSignupPress: () => void;
  onForgotPasswordPress: () => void;
}

export function LoginSheet({ onClose, onSignupPress, onForgotPasswordPress }: LoginSheetProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((state) => state.login);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(email, password);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.handle} />
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text>Cancel</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <Button
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
            style={styles.button}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <View style={styles.links}>
            <Pressable onPress={onForgotPasswordPress}>
              <Text style={styles.link}>Forgot Password?</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable onPress={onSignupPress}>
              <Text style={styles.link}>Create Account</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 12,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  link: {
    color: '#0a7ea4',
    fontSize: 14,
  },
  divider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
});
