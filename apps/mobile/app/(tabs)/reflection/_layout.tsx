import { Stack } from 'expo-router';

export default function ReflectionLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="chat-reflection"
        options={{
          headerShown: true,
          headerTitle: 'Chat Reflection',
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen name="histories"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}
