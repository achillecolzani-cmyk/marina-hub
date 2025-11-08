import React from "react";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function MarinaScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Marina Info",
        }}
      />
      <ThemedText type="title">Pagina Info Marina</ThemedText>
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
