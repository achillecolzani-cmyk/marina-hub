import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

// Define icons for all the tabs
const tabIcons: Record<string, string> = {
  // New: Dashboard icon
  index: "📊",
  // Dedicated Chatbot icon
  chatbot: "💬",
  // Existing unused tabs (kept for completeness)
  "apertura-porte": "🔓",
  marina: "🌊",
  // Segnalazione Problema icon
  "segnala-manutenzione": "⚠️",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#6B7280",
        tabBarShowLabel: true,
        tabBarIndicatorStyle: { height: 0 },
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -3 },
          height: Platform.OS === "android" ? 64 : 80,
          paddingBottom: Platform.OS === "android" ? 8 : 20,
        },
      }}
    >
      {/* 1. Dashboard (index.tsx) - Assumed to be your main screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                color: focused ? "#007AFF" : "#6B7280",
              }}
            >
              Dashboard
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>{tabIcons["index"]}</Text>
          ),
        }}
      />

      {/* 2. AI Chat (chatbot.tsx) */}
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "AI Chat",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                color: focused ? "#007AFF" : "#6B7280",
              }}
            >
              AI Chat
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>{tabIcons["chatbot"]}</Text>
          ),
        }}
      />

      {/* 3. Segnalazione Problema (segnala-manutenzione.tsx) */}
      <Tabs.Screen
        name="segnala-manutenzione"
        options={{
          title: "Segnala Problema",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 12,
                color: focused ? "#007AFF" : "#6B7280",
              }}
            >
              Problema
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>
              {tabIcons["segnala-manutenzione"]}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
