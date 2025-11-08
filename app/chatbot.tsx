import { Stack } from "expo-router"; // 1. Importa Stack!
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

// --- ECCO IL TUO WEBHOOK GIÀ INSERITO ---
const N8N_WEBHOOK_URL =
  "https://aiagent2000.app.n8n.cloud/webhook-test/462e8935-b53b-487d-871f-d43aca41961d";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export default function ChatbotScreen() {
  // 2. Nome della funzione cambiato
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        },
        body: JSON.stringify({
          text: currentMessage,
        }),
      });

      const responseData = await response.json();

      // Qui usiamo 'responseText' come chiave
      const botResponse: Message = {
        id: String(new Date().getTime() + 1),
        text: responseData.responseText || "Non ho capito.",
        sender: "bot",
      };

      setChatHistory((prevHistory) => [botResponse, ...prevHistory]);
    } catch (error) {
      console.error("Errore di rete:", error);
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

  return (
    // 3. SafeAreaView gestisce l'area sicura
    <SafeAreaView style={styles.container}>
      {/* 4. Questo aggiunge il titolo e il pulsante "Indietro" */}
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

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>n8n sta pensando...</Text>
        </View>
      )}

      {/* 5. KeyboardAvoidingView è ancora necessario */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Aggiustamento per lo Stack
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

// --- Gli stili sono identici a prima, con 'container' aggiornato ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Sfondo coerente
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "80%",
    marginVertical: 5,
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
    backgroundColor: "#A9A9A9",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
