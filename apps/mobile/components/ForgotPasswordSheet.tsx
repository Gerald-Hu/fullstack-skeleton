import React, { useState } from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { View, Text } from './Themed';
import { Button } from './Button';
import { useStore } from '@/stores';

interface ForgotPasswordSheetProps {
  onReset: (email: string) => void;
  onLoginPress: () => void;
}

export function ForgotPasswordSheet({ onReset, onLoginPress }: ForgotPasswordSheetProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useStore(state => state.auth);

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      onReset(email);
      setIsSent(true);
    } catch (error) {
      console.error('Reset password failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        
        {!isSent ? (
          <View style={styles.form}>
            <Text style={styles.description}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

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

            <Button
              onPress={handleResetPassword}
              disabled={isLoading || !email}
              style={styles.button}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            <View style={styles.footer}>
              <Text>Remember your password? </Text>
              <Pressable onPress={onLoginPress}>
                <Text style={styles.link}>Log in</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.description}>
              We've sent password reset instructions to {email}. Please check your email.
            </Text>

            <Button onPress={onLoginPress} style={styles.button}>
              Return to Login
            </Button>
          </View>
        )}
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
  description: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  link: {
    color: '#0a7ea4',
  },
});
