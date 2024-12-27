import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Image, Platform, View } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          elevation: 2
        },
        tabBarItemStyle: {
          paddingVertical: 5
        },
        tabBarStyle: {
          height: Platform.select({ios: 90, android: 60}), 
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          elevation: 10,
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        headerLeft: props => <View style={{ flex: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require("@/assets/images/refukids.png")}
            alt='Logo Refukids'
            style={{ width: 45, height: 45, objectFit: 'contain' }} />
        </View>
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Listagem',
          tabBarLabelStyle: {
            fontSize: 14,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="grid" color={color} />,
        }}
      />
      <Tabs.Screen
        name="adicionar"
        options={{
          title: 'Adicionar',
          tabBarLabelStyle: {
            fontSize: 14,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="edit" color={color} />,
        }}
      />
    </Tabs>
  );
}
