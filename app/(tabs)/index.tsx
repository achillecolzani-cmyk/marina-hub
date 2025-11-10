import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
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
        <Image
          source={require("@/assets/images/marina.png")}
          style={styles.headerImage}
        />
      }
    >
      {/* SECTION: Header */}
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

      {/* SECTION: Grid Menu */}
      <View style={styles.menuContainer}>
        {/* --- 1. Link to TAB: 'chatbot' --- */}
        <Link href="/chatbot" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedView
              style={styles.buttonInner}
              lightColor="#F5F5F5"
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
          </Pressable>
        </Link>

        {/* --- 2. Link to TAB: 'apertura-porte' --- */}
        <Link href="/apertura-porte" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedView
              style={styles.buttonInner}
              lightColor="#F5F5F5"
              darkColor="#2C2C2E"
            >
              <IconSymbol
                name="lock.open.fill"
                size={32}
                color="#007AFF"
                style={styles.buttonIcon}
              />
              <ThemedText style={styles.buttonText}>Apertura Porte</ThemedText>
            </ThemedView>
          </Pressable>
        </Link>

        {/* --- 3. Link to TAB: 'marina' --- */}
        <Link href="/marina" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedView
              style={styles.buttonInner}
              lightColor="#F5F5F5"
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
          </Pressable>
        </Link>

        {/* --- 4. Link to TAB: 'segnala-manutenzione' --- */}
        <Link href="/segnala-manutenzione" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.menuButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedView
              style={styles.buttonInner}
              lightColor="#007AFF"
              darkColor="#0A84FF"
            >
              <IconSymbol
                name="exclamationmark.bubble.fill"
                size={32}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <ThemedText style={[styles.buttonText, styles.buttonTextPrimary]}>
                Segnala Problema
              </ThemedText>
              {/* --- THIS WAS THE TYPO --- */}
            </ThemedView>
            {/* Was </TopMContainer>, now corrected to </ThemedView> */}
            {/* --- END OF FIX --- */}
          </Pressable>
        </Link>
      </View>
    </ParallaxScrollView>
  );
}

// --- Styles with the layout fix ---
const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#8A8A8E",
    marginTop: 8,
    marginBottom: 32,
    fontFamily: Fonts.rounded,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  menuButton: {
    width: "48%", // 2-column layout
    aspectRatio: 1, // Forces it to be a square
  },
  buttonInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonIcon: {
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    minHeight: 40, // Ensures vertical alignment for text of different lengths
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
  },
});
