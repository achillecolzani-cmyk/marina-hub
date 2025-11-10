import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

// Componente per il controllo di una singola porta
const DoorControl = ({
  name,
  icon,
}: {
  name: string;
  icon: React.ComponentProps<typeof IconSymbol>["name"];
}) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = () => {
    setIsUnlocking(true);
    // Simula una chiamata di rete per sbloccare la porta
    setTimeout(() => {
      setIsUnlocking(false);
      setIsUnlocked(true);
      // Ritorna allo stato "bloccato" dopo 3 secondi
      setTimeout(() => setIsUnlocked(false), 3000);
    }, 1500);
  };

  const getButtonState = () => {
    if (isUnlocking) {
      return {
        text: "Sblocco...",
        style: styles.buttonUnlocking,
        disabled: true,
      };
    }
    if (isUnlocked) {
      return {
        text: "Sbloccata",
        style: styles.buttonUnlocked,
        disabled: true,
      };
    }
    return { text: "Sblocca", style: styles.buttonLocked, disabled: false };
  };

  const buttonState = getButtonState();

  return (
    <ThemedView style={styles.card}>
      <View style={styles.cardInfo}>
        <IconSymbol name={icon} size={28} color="#007AFF" />
        <ThemedText style={styles.cardTitle}>{name}</ThemedText>
      </View>
      <TouchableOpacity
        style={[styles.buttonBase, buttonState.style]}
        onPress={handleUnlock}
        disabled={buttonState.disabled}
      >
        {isUnlocking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>{buttonState.text}</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
};

// Schermata principale
export default function AperturaPorteScreen() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Apertura Porte",
        }}
      />
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.pageTitle}>
          Controllo Accessi
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Seleziona la porta da sbloccare. L'accesso è temporaneo.
        </ThemedText>

        {/* Elenco delle porte */}
        <DoorControl icon="door.left.hand.open" name="Ingresso Principale" />
        <DoorControl icon="figure.pool.swim" name="Accesso Piscina" />
        <DoorControl icon="bicycle" name="Deposito Biciclette" />
      </ThemedView>
    </ScrollView>
  );
}

// Stili
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontFamily: Fonts.rounded,
  },
  subtitle: {
    fontSize: 18,
    color: "#8A8A8E",
    marginTop: 8,
    marginBottom: 32,
    fontFamily: Fonts.rounded,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Permette al testo di andare a capo se lungo
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
    marginLeft: 12,
    flexShrink: 1, // Permette al testo di rimpicciolirsi se necessario
  },
  buttonBase: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100, // Larghezza minima per il pulsante
  },
  buttonLocked: {
    backgroundColor: "#007AFF",
  },
  buttonUnlocking: {
    backgroundColor: "#F0AD4E", // Arancione (in attesa)
  },
  buttonUnlocked: {
    backgroundColor: "#5CB85C", // Verde (successo)
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
