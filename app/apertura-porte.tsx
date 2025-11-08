import React from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function AperturaPorteScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Apertura Porte",
        }}
      />
      <ThemedText type="title">Pagina Apertura Porte</ThemedText>
      <ThemedText>Pagina in costruzione...</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
