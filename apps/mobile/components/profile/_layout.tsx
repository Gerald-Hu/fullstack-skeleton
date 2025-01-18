import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="goal-history"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="help-support"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}
