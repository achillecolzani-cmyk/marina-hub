// app/(tabs)/chatbot.tsx

import { IconSymbol } from "@/components/ui/icon-symbol";

import { Fonts } from "@/constants/theme";

import * as Crypto from "expo-crypto";

import { Stack } from "expo-router";

import React, { useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const N8N_WEBHOOK_URL =
  "https://aiagent2000.app.n8n.cloud/webhook/2d4a3f36-2ff1-4874-b5bf-bc7da5a44a79";

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

  const handleSend = async () => {
    const currentMessage = message.trim();

    if (currentMessage === "" || isLoading) return;

    setIsLoading(true);

    const userMessage: Message = {
      id: String(new Date().getTime()),

      text: currentMessage,

      sender: "user",
    };

    setChatHistory((prev) => [userMessage, ...prev]);

    setMessage("");

    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ text: currentMessage, chatId }),

        signal: controller.signal,
      });

      clearTimeout(timeout);

      let parsedResponse: any = null;

      try {
        parsedResponse = await response.clone().json();
      } catch {
        const raw = await response.text();

        if (raw.startsWith("{")) parsedResponse = JSON.parse(raw);
      }

      if (response.ok && parsedResponse) {
        const botMessage: Message = {
          id: String(new Date().getTime() + 1),

          text: parsedResponse.responseText || "Non ho capito.",

          sender: "bot",
        };

        setChatHistory((prev) => [botMessage, ...prev]);
      } else {
        throw new Error("Unexpected response from backend");
      }
    } catch {
      const errorMessage: Message = {
        id: String(new Date().getTime() + 1),

        text: "Errore di connessione con n8n.",

        sender: "bot",
      };

      setChatHistory((prev) => [errorMessage, ...prev]);
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

  const renderTypingIndicator = () => (
    <View style={[styles.messageBubble, styles.botBubble]}>
      <ActivityIndicator size="small" color="#003366" />
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: "#003366" },

            headerTintColor: "#FFFFFF",

            headerTitle: "Chatbot Assistente",
          }}
        />

        <FlatList
          style={styles.chatList}
          data={chatHistory}
          inverted
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        {isLoading && renderTypingIndicator()}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.chatContainer}>
            <TextInput
              style={styles.input}
              placeholder="Scrivi un messaggio..."
              placeholderTextColor="#8A8A8E"
              value={message}
              onChangeText={setMessage}
              editable={!isLoading}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.sendButton,

                isLoading && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={isLoading}
            >
              <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFFFFF",
  },

  chatList: {
    flex: 1,

    paddingHorizontal: 14,
  },

  messageBubble: {
    padding: 14,

    paddingHorizontal: 18,

    borderRadius: 20,

    maxWidth: "80%",

    marginVertical: 6,

    shadowColor: "#000",

    shadowOffset: { width: 0, height: 1 },

    shadowOpacity: 0.06,

    shadowRadius: 3,

    elevation: 2,
  },

  userBubble: {
    backgroundColor: "#007AFF",

    alignSelf: "flex-end",
  },

  userText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontFamily: Fonts.rounded,
  },

  botBubble: {
    backgroundColor: "#F1F1F3",

    alignSelf: "flex-start",
  },

  botText: {
    color: "#111",

    fontSize: 16,

    fontFamily: Fonts.rounded,
  },

  chatContainer: {
    padding: 10,

    backgroundColor: "#FFFFFF",

    shadowColor: "#000",

    shadowOffset: { width: 0, height: -2 },

    shadowOpacity: 0.06,

    shadowRadius: 6,

    elevation: 5,

    flexDirection: "row",

    alignItems: "flex-end",

    paddingBottom: Platform.OS === "ios" ? 24 : 12,
  },

  keyboardView: {},

  input: {
    flex: 1,

    backgroundColor: "#EFEFF1",

    borderRadius: 22,

    paddingHorizontal: 18,

    paddingVertical: 12,

    fontSize: 16,

    fontFamily: Fonts.rounded,

    marginRight: 10,

    maxHeight: 120,
  },

  sendButton: {
    backgroundColor: "#007AFF",

    width: 46,

    height: 46,

    borderRadius: 23,

    justifyContent: "center",

    alignItems: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
});
