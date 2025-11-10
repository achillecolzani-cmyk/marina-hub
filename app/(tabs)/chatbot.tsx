import * as Crypto from "expo-crypto";
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
// 1. Import IconSymbol and Fonts for the new UI
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

const N8N_WEBHOOK_URL =
  "https://aiagent2000.app.n8n.cloud/webhook/462e8935-b53b-487d-871f-d43aca41961d";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function ChatbotScreen() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [chatId] = useState(() => Crypto.randomUUID());

  // --- La tua robusta logica handleSend rimane invariata ---
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
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: currentMessage,
          chatId,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const status = response.status;
      const contentType = response.headers.get("content-type") || "";

      let parsed: any | null = null;
      let rawText: string | null = null;

      try {
        parsed = await response.clone().json();
      } catch {
        try {
          rawText = await response.text();
          if (rawText && rawText.trim().startsWith("{")) {
            parsed = JSON.parse(rawText);
          }
        } catch {
          // Manteniamo parsed = null
        }
      }

      if (response.ok && parsed) {
        const botResponse: Message = {
          id: String(new Date().getTime() + 1),
          text: parsed.responseText || "Non ho capito.",
          sender: "bot",
        };
        setChatHistory((prevHistory) => [botResponse, ...prevHistory]);
      } else {
        console.error(
          "Risposta inattesa da n8n",
          JSON.stringify({
            status,
            contentType,
            parsed,
            rawText: rawText?.slice(0, 300),
          })
        );
        throw new Error(
          `Richiesta fallita (status ${status}). Content-Type: ${contentType}`
        );
      }
    } catch (error: any) {
      console.error("Errore in handleSend:", error?.message || error);
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

  // --- UI Riorganizzata ---

  // Per pulizia, ho spostato il render dell'item in una sua funzione
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

  // Un componente per il "typing" del bot
  const renderTypingIndicator = () => (
    <View style={[styles.messageBubble, styles.botBubble]}>
      <ActivityIndicator size="small" color="#000" />
    </View>
  );

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
        // 2. Aggiunto spazio in fondo (che è in alto con 'inverted')
        contentContainerStyle={{
          paddingBottom: 10,
        }}
      />

      {/* 3. L'indicatore di caricamento ora è un componente "typing" */}
      {isLoading && renderTypingIndicator()}

      {/* 4. Input bar riprogettata */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          <TextInput
            style={styles.input}
            placeholder="Scrivi un messaggio..."
            placeholderTextColor="#9A9A9A"
            value={message}
            onChangeText={setMessage}
            editable={!isLoading}
            multiline // Permette all'input di crescere
          />
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            {/* 5. Icona al posto del testo */}
            <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Stili Aggiornati ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Sfondo bianco pulito
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    padding: 12,
    paddingHorizontal: 16, // Più spazio orizzontale
    borderRadius: 20,
    maxWidth: "80%",
    marginVertical: 5,
    // 6. Aggiunta ombra per un look più "nativo"
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  userText: {
    color: "#fff",
    fontSize: 16,
  },
  botBubble: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  botText: {
    color: "#000",
    fontSize: 16,
  },
  // Stili input bar
  keyboardView: {},
  chatContainer: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    // 7. Sostituito il bordo con un'ombra più morbida
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
    // ---
    paddingBottom: Platform.OS === "ios" ? 20 : 10, // Padding per la home bar
    flexDirection: "row",
    alignItems: "flex-end", // Allinea in basso per 'multiline'
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0", // Sfondo input più scuro
    borderRadius: 20, // Stesso raggio del pulsante
    paddingHorizontal: 18,
    paddingVertical: 12, // Più alto
    fontSize: 16,
    marginRight: 10,
    maxHeight: 120, // Limite per 'multiline'
  },
  sendButton: {
    backgroundColor: "#007AFF",
    // 8. Pulsante circolare
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    bottom: 2, // Allineamento fine
  },
  sendButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  // 9. Rimosso sendButtonText, non più necessario
});
