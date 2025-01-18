import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarStyle: {
          position: 'absolute',
          height: 80,
          backgroundColor: '#f1f2f3',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarLabelStyle:{
          fontSize: 13,
          color: "#353535"
        },
        tabBarButton: (props) => <HapticTab {...props} />,
        headerShown: false,
      }}>

      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: 'Plans',
          tabBarIcon: () => null,
        }}
      />

      <Tabs.Screen
        name="reflection"
        options={{
          title: 'Reflections',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
