import React from "react";
import { StyleSheet, View, Pressable } from "react-native"; // 1. Importa Pressable
import { Link } from "expo-router";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

export default function DashboardScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FFFFFF", dark: "#1D1D1D" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="square.grid.2x2" // 2. Icona corretta
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Marina Hub
        </ThemedText>
      </ThemedView>
      <ThemedText style={styles.subtitle}>Seleziona un servizio</ThemedText>

      {/* 3. Contenitore della griglia */}
      <View style={styles.menuContainer}>
        {/* Pulsante Chatbot */}
        <Link href="/chatbot" asChild style={styles.menuButton}>
          <Pressable>
            {({ pressed }) => (
              <ThemedView
                style={[styles.buttonInner, { opacity: pressed ? 0.7 : 1 }]}
                lightColor="#F0F0F0"
                darkColor="#2C2C2E"
              >
                <IconSymbol
                  name="message.fill"
                  size={32}
                  color="#007AFF"
                  style={styles.buttonIcon}
                />
                <ThemedText style={styles.buttonText}>Chatbot</ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </Link>

        {/* Pulsante Apertura Porte */}
        <Link href="/apertura-porte" asChild style={styles.menuButton}>
          <Pressable>
            {({ pressed }) => (
              <ThemedView
                style={[styles.buttonInner, { opacity: pressed ? 0.7 : 1 }]}
                lightColor="#F0F0F0"
                darkColor="#2C2C2E"
              >
                <IconSymbol
                  name="lock.open.fill"
                  size={32}
                  color="#007AFF"
                  style={styles.buttonIcon}
                />
                <ThemedText style={styles.buttonText}>
                  Apertura Porte
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </Link>

        {/* Pulsante Marina */}
        <Link href="/marina" asChild style={styles.menuButton}>
          <Pressable>
            {({ pressed }) => (
              <ThemedView
                style={[styles.buttonInner, { opacity: pressed ? 0.7 : 1 }]}
                lightColor="#F0F0F0"
                darkColor="#2C2C2E"
              >
                <IconSymbol
                  name="water.waves"
                  size={32}
                  color="#007AFF"
                  style={styles.buttonIcon}
                />
                <ThemedText style={styles.buttonText}>Marina</ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </Link>

        {/* Pulsante Segnala Manutenzione */}
        <Link href="/segnala-manutenzione" asChild style={styles.menuButton}>
          <Pressable>
            {({ pressed }) => (
              <ThemedView
                style={[styles.buttonInner, { opacity: pressed ? 0.7 : 1 }]}
                // Colori di accento per questo pulsante
                lightColor="#F0AD4E"
                darkColor="#D9534F"
              >
                <IconSymbol
                  name="exclamationmark.bubble.fill"
                  size={32}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
                <ThemedText
                  style={[styles.buttonText, styles.buttonTextReport]}
                >
                  Segnala Problema
                </ThemedText>
              </ThemedView>
            )}
          </Pressable>
        </Link>
      </View>
    </ParallaxScrollView>
  );
}

// 4. Stili completamente nuovi per la griglia
const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginTop: 8,
    marginBottom: 24,
    fontFamily: Fonts.rounded,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  menuButton: {
    width: "48%", // Imposta la larghezza per 2 colonne
    aspectRatio: 1, // Rende il pulsante quadrato
  },
  buttonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
  },
  buttonIcon: {
    marginBottom: 12, // Spazio tra icona e testo
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    textAlign: "center", // Centra il testo
  },
  buttonTextReport: {
    color: "#FFFFFF", // Testo bianco per il pulsante di segnalazione
  },
});
