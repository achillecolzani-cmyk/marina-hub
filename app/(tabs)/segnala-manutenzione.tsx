import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  useColorScheme,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Stack } from "expo-router"; // 1. Importa Stack
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

// Questo è il codice del tuo vecchio file 'explore.tsx', ora spostato qui
const CATEGORIES = ["Manutenzione", "Pulizia", "Rumore", "Wi-Fi", "Altro"];

export default function ReportProblemScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme() ?? "light";

  // ... (stili dinamici e logica handleSubmit) ...
  const inputBg = colorScheme === "light" ? "#FFFFFF" : "#2C2C2E";
  const inputBorder = colorScheme === "light" ? "#CCCCCC" : "#444444";
  const inputText = colorScheme === "light" ? "#000000" : "#FFFFFF";
  const categoryBg = colorScheme === "light" ? "#F2F27" : "#2C2C2E";
  const categoryBorder = colorScheme === "light" ? "#E5E5EA" : "#444444";
  const categoryText = colorScheme === "light" ? "#000000" : "#FFFFFF";

  const handleSubmit = async () => {
    if (!selectedCategory || description.trim() === "") {
      Alert.alert(
        "Campi Mancanti",
        "Per favore, seleziona una categoria e inserisci una descrizione."
      );
      return;
    }
    setIsLoading(true);
    const REPORT_WEBHOOK_URL = "IL_TUO_NUOVO_WEBHOOK_URL_N8N";
    try {
      // Simula chiamata di rete
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert(
        "Grazie!",
        "La tua segnalazione è stata inviata con successo."
      );
      setSelectedCategory(null);
      setDescription("");
    } catch (error) {
      console.error("Errore invio segnalazione:", error);
      Alert.alert(
        "Errore",
        "Impossibile inviare la segnalazione. Riprova più tardi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 2. Aggiunto KeyboardAvoidingView
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* 3. Aggiunto Stack.Screen per il titolo e il tasto indietro */}
      <Stack.Screen
        options={{
          title: "Segnala un Problema",
        }}
      />
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#F0AD4E", dark: "#D9534F" }}
        headerImage={
          <IconSymbol
            size={310}
            color="#FFF"
            name="exclamationmark.bubble"
            style={styles.headerImage}
          />
        }
      >
        {/* Il resto del tuo form rimane invariato */}
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
            }}
          >
            Segnala un Problema
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.subtitle}>
          Aiutaci a migliorare il servizio. Seleziona una categoria e descrivi
          il problema.
        </ThemedText>

        <ThemedView style={styles.formContainer}>
          <ThemedText style={styles.label}>
            1. Seleziona una Categoria
          </ThemedText>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  { backgroundColor: categoryBg, borderColor: categoryBorder },
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                disabled={isLoading}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    { color: categoryText },
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <ThemedText style={styles.label}>2. Descrivi il Problema</ThemedText>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: inputText,
              },
            ]}
            multiline
            numberOfLines={6}
            placeholder="Descrivi in dettaglio cosa non funziona..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <ThemedText style={styles.submitButtonText}>
              {isLoading ? "Invio in corso..." : "Invia Segnalazione"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

// 4. Gli stili sono identici a quelli del tuo file explore.tsx
const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    marginBottom: 16,
  },
  formContainer: {
    paddingBottom: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 12,
    fontFamily: Fonts.rounded,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryText: {
    fontWeight: "500",
    fontSize: 15,
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  textInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    paddingTop: 12,
    fontSize: 16,
    minHeight: 140,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#D9534F",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: Fonts.rounded,
  },
});
