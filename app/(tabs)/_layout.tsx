import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,

        // --- 1. This explicitly hides all text labels ---
        tabBarShowLabel: false,
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          // 'title' removed (no longer needed for the tab)
          headerTitle: "HomePage", // KEEPS the back button fix
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* 2. Marina Tab */}
      <Tabs.Screen
        // This MUST match your file: app/(tabs)/marina.tsx
        name="marina"
        options={{
          // 'title' removed
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="water.waves" color={color} />
          ),
        }}
      />

      {/* 3. Chatbot Tab */}
      <Tabs.Screen
        // This MUST match your file: app/(tabs)/chatbot.tsx
        name="chatbot"
        options={{
          // 'title' removed
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message.fill" color={color} />
          ),
        }}
      />

      {/* 4. Apertura Porte Tab */}
      <Tabs.Screen
        // This MUST match your file: app/(tabs)/apertura-porte.tsx
        name="apertura-porte"
        options={{
          // 'title' removed
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="lock.open.fill" color={color} />
          ),
        }}
      />

      {/* 5. Segnala Manutenzione Tab */}
      <Tabs.Screen
        // This MUST match your file: app/(tabs)/segnala-manutenzione.tsx
        name="segnala-manutenzione"
        options={{
          // 'title' removed
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="exclamationmark.bubble.fill"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
