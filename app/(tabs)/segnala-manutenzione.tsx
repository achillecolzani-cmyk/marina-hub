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
  ActivityIndicator, // 1. Importa ActivityIndicator
} from "react-native";
import { Stack } from "expo-router";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

// --- 1. INCOLLA QUI L'URL DEL WEBHOOK N8N ---
// Questo è il webhook che riceverà la segnalazione
const N8N_WEBHOOK_URL = "INCOLLA_QUI_IL_TUO_URL_WEBHOOK_PER_LE_SEGNALAZIONI";

const CATEGORIES = ["Manutenzione", "Pulizia", "Rumore", "Wi-Fi", "Altro"];

export default function ReportProblemScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme() ?? "light";

  // Stili dinamici in base al tema
  const inputBg = colorScheme === "light" ? "#FFFFFF" : "#2C2C2E";
  const inputBorder = colorScheme === "light" ? "#CCCCCC" : "#444444";
  const inputText = colorScheme === "light" ? "#000000" : "#FFFFFF";
  const categoryBg = colorScheme === "light" ? "#F2F2F7" : "#2C2C2E";
  const categoryBorder = colorScheme === "light" ? "#E5E5EA" : "#444444";
  const categoryText = colorScheme === "light" ? "#000000" : "#FFFFFF";

  // --- 2. Funzione handleSubmit aggiornata ---
  const handleSubmit = async () => {
    if (!selectedCategory || description.trim() === "") {
      Alert.alert(
        "Campi Mancanti",
        "Per favore, seleziona una categoria e inserisci una descrizione."
      );
      return;
    }

    if (
      N8N_WEBHOOK_URL === "INCOLLA_QUI_IL_TUO_URL_WEBHOOK_PER_LE_SEGNALAZIONI"
    ) {
      Alert.alert(
        "Webhook Mancante",
        "Per favore, inserisci l'URL del webhook n8n nel codice."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Invia i dati a n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedCategory,
          description: description.trim(),
          sentAt: new Date().toISOString(),
        }),
      });

      // Controlla se n8n ha risposto correttamente
      if (!response.ok) {
        // Lancia un errore se la risposta non è 2xx
        throw new Error(`Errore dal server n8n: ${response.status}`);
      }

      // Tutto ok, mostra successo
      Alert.alert(
        "Grazie!",
        "La tua segnalazione è stata inviata con successo."
      );
      // Pulisci il form
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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

          {/* --- 3. Pulsante di invio aggiornato --- */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              // Mostra l'indicatore di caricamento
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              // Mostra il testo
              <ThemedText style={styles.submitButtonText}>
                Invia Segnalazione
              </ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

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
    justifyContent: "space-between",
    rowGap: 16, // Usa rowGap per griglia corretta
  },
  categoryButton: {
    width: "48%", // 2-column layout
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    aspectRatio: 2.5, // Mantiene una forma consistente
    justifyContent: "center", // Centra il testo verticalmente
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryText: {
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
    fontFamily: Fonts.rounded,
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
    minHeight: 50, // Altezza minima per contenere l'indicatore
    justifyContent: "center",
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
