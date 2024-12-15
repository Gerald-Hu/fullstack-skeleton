import React, { useState } from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { View, Text } from '@components/Themed';
import { Button } from './Button';

interface LoginSheetProps {
  onLogin: (email: string, password: string) => void;
  onSignupPress: () => void;
  onForgotPasswordPress: () => void;
}

export function LoginSheet({ onLogin, onSignupPress, onForgotPasswordPress }: LoginSheetProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      onLogin(email, password);
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

      <View className='flex-1 px-4 mb-8'>
        <Text className='text-3xl font-bold mb-2 items-center text-center light:text-gray-900 dark:text-red-600'>Welcome Back</Text>
        
        <View className='gap-4'>
          <View className='gap-2'>
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
