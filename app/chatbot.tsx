import * as Crypto from "expo-crypto"; // Importa expo-crypto
import { Stack } from "expo-router";
import { useState } from "react";
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
      // Timeout esplicito per evitare richieste pendenti
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Rimuoviamo l'header custom per evitare eventuali blocchi/WAF
          // "X-Chat-Id": chatId,
        },
        body: JSON.stringify({
          text: currentMessage,
          // Se serve correlazione lato n8n, includiamo il chatId nel body
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
        // Proviamo comunque a parsare JSON anche se l'header non è perfetto
        parsed = await response.clone().json();
      } catch {
        try {
          rawText = await response.text();
          // Tentativo di parse se il server ha mandato JSON ma content-type non standard
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
          JSON.stringify({ status, contentType, parsed, rawText: rawText?.slice(0, 300) })
        );
        throw new Error(
          `Richiesta fallita (status ${status}). Content-Type: ${contentType}`
        );
      }
    } catch (error: any) {
      // Mostra un errore più informativo nel log e un messaggio utente generico
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
