import * as Crypto from "expo-crypto"; // Importa expo-crypto
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 1. INCOLLA QUI IL TUO URL DI *PRODUZIONE*
// Assicurati che sia l'URL di PRODUZIONE e che il workflow sia ATTIVO
const N8N_WEBHOOK_URL =
  "https://aiagent2000.app.n8n.cloud/webhook-test/462e8935-b53b-487d-871f-d43aca41961d";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function ChatbotScreen() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Usa EXPO-CRYPTO per generare il UUID per questa sessione
  const [chatId] = useState(() => Crypto.randomUUID());

  const handleSend = async () => {
    const currentMessage = message.trim();
    if (currentMessage === "" || isLoading) {
      return;
    }

    setIsLoading(true);

    const userMessage: Message = {
      id: String(new Date().getTime()),
      text: currentMessage,
      sender: "user",
    };
    setChatHistory((prevHistory) => [userMessage, ...prevHistory]);
    setMessage("");

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Chat-Id": chatId, // Invia il Chat ID
        },
        body: JSON.stringify({
          text: currentMessage,
        }),
      });

      // 3. Controllo robusto della risposta (per evitare l'errore JSON)
      const contentType = response.headers.get("content-type");
      if (
        response.ok &&
        contentType &&
        contentType.includes("application/json")
      ) {
        // TUTTO OK: n8n ha risposto con JSON
        const responseData = await response.json();
        const botResponse: Message = {
          id: String(new Date().getTime() + 1),
          text: responseData.responseText || "Non ho capito.",
          sender: "bot",
        };
        setChatHistory((prevHistory) => [botResponse, ...prevHistory]);
      } else {
        // ERRORE: n8n non ha risposto con JSON (es. errore HTML o workflow inattivo)
        const errorText = await response.text();
        console.error("Risposta non-JSON da n8n:", errorText);
        // Lancia l'errore che hai visto
        throw new Error("La risposta del server non è in formato JSON.");
      }
    } catch (error) {
      // Cattura l'errore sopra o un errore di rete
      console.error("Errore in handleSend:", error);
      const errorResponse: Message = {
        id: String(new Date().getTime() + 1),
        text: "Errore di connessione con n8n.",
        sender: "bot",
      };
      setChatHistory((prevHistory) => [errorResponse, ...prevHistory]);
    } finally {
      setIsLoading(false);
    }
  };

  // Funzione per renderizzare le bolle di chat
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={isUser ? styles.userText : styles.botText}>
          {item.text}
        </Text>
      </View>
    );
  };

  // UI
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Chatbot",
        }}
      />

      <FlatList
        style={styles.chatList}
        data={chatHistory}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
      />

      {/* Indicatore di caricamento */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>n8n sta pensando...</Text>
        </View>
      )}

      {/* Input bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Stili
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5ff", // Sfondo leggermente azzurro
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  // Stili bolle di chat
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "80%",
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: "#007AFF", // Blu per l'utente
    alignSelf: "flex-end",
  },
  userText: {
    color: "#fff",
    fontSize: 16,
  },
  botBubble: {
    backgroundColor: "#E5E5EA", // Grigio per il bot
    alignSelf: "flex-start",
  },
  botText: {
    color: "#000",
    fontSize: 16,
  },
  // Stili caricamento
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: "#999",
    fontSize: 14,
  },
  // Stili input bar
  keyboardView: {},
  chatContainer: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "#A9A9A9", // Grigio quando disabilitato
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
