import { StyleSheet, View, Modal } from 'react-native';
import { useStore } from '@/stores';
import { Text } from '@/components/Themed';
import { Button } from '@/components/Button';
import { LoginSheet } from '@/components/LoginSheet';
import { SignupSheet } from '@/components/SignupSheet';
import { ForgotPasswordSheet } from '@/components/ForgotPasswordSheet';
import { useState } from 'react';

type Sheet = 'login' | 'signup' | 'forgotPassword' | null;

export default function ProfileScreen() {
  const { user, accessToken, logout, isAuthenticated } = useStore();
  const [activeSheet, setActiveSheet] = useState<Sheet>(null);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Not Logged In</Text>
        <Button 
          onPress={() => setActiveSheet('login')} 
          style={styles.button}
        >
          Login
        </Button>

        <Modal
          visible={activeSheet !== null}
          onRequestClose={() => setActiveSheet(null)}
          animationType="slide"
          presentationStyle="pageSheet"
          statusBarTranslucent
        >
          {activeSheet === 'login' && (
            <LoginSheet 
              onClose={() => setActiveSheet(null)}
              onSignupPress={() => setActiveSheet('signup')}
              onForgotPasswordPress={() => setActiveSheet('forgotPassword')}
            />
          )}
          {activeSheet === 'signup' && (
            <SignupSheet 
              onClose={() => setActiveSheet(null)}
              onLoginPress={() => setActiveSheet('login')}
            />
          )}
          {activeSheet === 'forgotPassword' && (
            <ForgotPasswordSheet 
              onClose={() => setActiveSheet(null)}
              onLoginPress={() => setActiveSheet('login')}
            />
          )}
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>
      
      <View style={styles.infoContainer}>
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
      </View>

      <Button 
        onPress={logout}
        variant="secondary"
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  infoContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 32,
  },
  button: {
    marginBottom: 20,
  },
  logoutButton: {
    marginBottom: 20,
  },
});
