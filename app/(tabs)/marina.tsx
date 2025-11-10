import React from "react";
import { StyleSheet, ScrollView, View } from "react-native"; // 1. Importa ScrollView
import { Stack } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol"; // 2. Importa IconSymbol
import { Fonts } from "@/constants/theme"; // 3. Importa Fonts

// Un piccolo componente Card per organizzare le informazioni
const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  title: string;
  children: React.ReactNode;
}) => (
  <ThemedView style={styles.card}>
    <View style={styles.cardHeader}>
      <IconSymbol name={icon} size={20} color="#007AFF" />
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
    </View>
    <ThemedText style={styles.cardContent}>{children}</ThemedText>
  </ThemedView>
);

export default function MarinaScreen() {
  return (
    // 4. Sostituito ThemedView con ScrollView
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Marina",
        }}
      />

      {/* 5. Contenuto della pagina spostato dentro ScrollView */}
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.pageTitle}>
          Marina Hub
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Informazioni e servizi utili per la tua permanenza.
        </ThemedText>

        <InfoCard icon="clock.fill" title="Orari Ufficio">
          Lunedì - Venerdì: 09:00 - 18:00
          {"\n"}
          Sabato: 09:00 - 13:00
          {"\n"}
          Domenica: Chiuso
        </InfoCard>

        <InfoCard icon="sparkles" title="Servizi Principali">
          • Acqua ed elettricità in banchina (24/7)
          {"\n"}• Wi-Fi gratuito in tutta l'area
          {"\n"}• Servizio di sorveglianza notturna
          {"\n"}• Ritiro rifiuti e oli esausti
        </InfoCard>

        <InfoCard icon="phone.fill" title="Contatti Utili">
          Ufficio Marina: +39 0422 123456
          {"\n"}
          Emergenze (H24): +39 333 654321
          {"\n"}
          Capitaneria di Porto: 1530
        </InfoCard>
      </ThemedView>
    </ScrollView>
  );
}

// 6. Stili aggiornati
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40, // Spazio extra in fondo
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: Fonts.rounded,
    marginLeft: 10,
  },
  cardContent: {
    fontSize: 16,
    lineHeight: 24, // Migliora la leggibilità
  },
});
