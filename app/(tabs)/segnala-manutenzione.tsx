import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const N8N_WEBHOOK_URL =
  "https://aiagent2000.app.n8n.cloud/webhook/22b96d08-98f8-46e1-9a5c-7c244aafeda2";

const CATEGORIES = ["Manutenzione", "Pulizia", "Rumore", "Wi-Fi", "Altro"];

export default function ReportProblemScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme() ?? "light";

  const inputBg = colorScheme === "light" ? "#FFFFFF" : "#1C1C1E";
  const inputBorder = colorScheme === "light" ? "#DDDDDD" : "#3A3A3C";
  const inputText = colorScheme === "light" ? "#000" : "#FFF";

  const categoryBg = colorScheme === "light" ? "#F5F7FA" : "#2C2C2E";
  const categoryBorder = colorScheme === "light" ? "#E5E5EA" : "#3A3A3C";
  const categoryText = colorScheme === "light" ? "#000" : "#FFF";

  const handleSubmit = async () => {
    if (!selectedCategory || description.trim() === "") {
      return Alert.alert(
        "Campi Mancanti",
        "Per favore seleziona una categoria e inserisci una descrizione."
      );
    }

    setIsLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          description: description.trim(),
          sentAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Errore invio n8n");

      Alert.alert("Segnalazione Inviata", "Grazie per averci informato!");
      setSelectedCategory(null);
      setDescription("");
    } catch {
      Alert.alert("Errore", "Impossibile inviare la segnalazione.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#003366", dark: "#003366" }}
        headerImage={
          <IconSymbol
            size={300}
            color="#FFF"
            name="wrench.and.screwdriver"
            style={styles.headerImage}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={[styles.title, { fontFamily: Fonts.rounded }]}>
            Segnala un Problema
          </ThemedText>
        </ThemedView>

        <ThemedText style={styles.subtitle}>
          Aiutaci a mantenere la struttura al massimo. Seleziona una categoria e
          descrivi il problema.
        </ThemedText>

        <ThemedView style={styles.formContainer}>
          {/* Categorie */}
          <ThemedText style={styles.label}>
            1. Seleziona una Categoria
          </ThemedText>

          <View style={styles.categoryContainer}>
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: categoryBg,
                      borderColor: categoryBorder,
                    },
                    active && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  disabled={isLoading}
                >
                  <ThemedText
                    style={[
                      styles.categoryText,
                      { color: categoryText },
                      active && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Descrizione */}
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
            placeholder="Descrivi cosa non funziona..."
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            editable={!isLoading}
          />

          {/* Pulsante Invio */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
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

/* -------------------------------- STILI -------------------------------- */

const styles = StyleSheet.create({
  headerImage: {
    position: "absolute",
    bottom: -60,
    left: -40,
    opacity: 0.25,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#003366",
  },

  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 22,
  },

  formContainer: {
    paddingBottom: 40,
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 16,
    color: "#003366",
    fontFamily: Fonts.rounded,
  },

  /* CATEGORIE */

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  categoryButton: {
    width: "48%",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1.4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },

  categoryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    shadowOpacity: 0.12,
  },

  categoryText: {
    fontSize: 16,
    fontFamily: Fonts.rounded,
    color: "#333",
  },

  categoryTextActive: {
    color: "#FFF",
    fontWeight: "700",
  },

  /* DESCRIZIONE */

  textInput: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: "top",
  },

  /* BUTTON SEND */

  submitButton: {
    backgroundColor: "#003366",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 26,
    alignItems: "center",
  },

  submitButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },

  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
  },
});
