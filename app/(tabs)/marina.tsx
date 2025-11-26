import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Service = {
  id: string;
  title: string;
  description: string;
  duration: string;
  capacity: string;
  tag: string;
  image: string;
  times: string[];
};

const SERVICES: Service[] = [
  {
    id: "whale",
    title: "Whale Watching",
    description: "Experience the majesty of ocean giants in their natural habitat.",
    duration: "3 hours",
    capacity: "20 people",
    tag: "Excursion",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    times: ["08:00 AM", "09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
  },
  {
    id: "dragon-boat",
    title: "Dragon Boat",
    description: "Team paddling experience on traditional dragon boats.",
    duration: "2 hours",
    capacity: "16 people",
    tag: "Water Sport",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80&sat=-30",
    times: ["08:00 AM", "09:00 AM", "10:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
  },
  {
    id: "kayak",
    title: "Kayaking",
    description: "Explore the marina at your own pace.",
    duration: "1-3 hours",
    capacity: "2 people per kayak",
    tag: "Water Sport",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80&sat=-10",
    times: ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
  },
  {
    id: "sup",
    title: "Stand-Up Paddleboard",
    description: "Balance and serenity on the calm marina waters.",
    duration: "1-2 hours",
    capacity: "1 person",
    tag: "Water Sport",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80&sat=10&exp=-10",
    times: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
  },
  {
    id: "bikes",
    title: "Bicycle Rental",
    description: "Explore coastal trails and nearby attractions.",
    duration: "Half/Full day",
    capacity: "1 person",
    tag: "Land Activity",
    image:
      "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?auto=format&fit=crop&w=1400&q=80",
    times: ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"],
  },
  {
    id: "coast",
    title: "Coastal Excursion",
    description: "Guided tour of the beautiful marina coastline.",
    duration: "4 hours",
    capacity: "12 people",
    tag: "Excursion",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    times: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM"],
  },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getMaxCapacity = (capacityLabel?: string | null) => {
  if (!capacityLabel) return 1;
  const match = capacityLabel.match(/\d+/);
  const parsed = match ? parseInt(match[0], 10) : NaN;
  return Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
};

export default function MarinaScreen() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [monthCursor, setMonthCursor] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);

  const calendarDays = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  }, [monthCursor]);

  const openBooking = (service: Service) => {
    const today = new Date();
    setSelectedService(service);
    setSelectedTime(null);
    setSelectedDate(today);
    setMonthCursor(today);
    setPeopleCount(1);
  };

  const closeBooking = () => {
    setSelectedService(null);
    setSelectedDate(new Date());
    setSelectedTime(null);
    setPeopleCount(1);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    setMonthCursor((prev) => {
      const nextMonth =
        direction === "next"
          ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
          : new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return nextMonth;
    });
  };

  const isSameDay = (a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      return Alert.alert(
        "Completa la selezione",
        "Scegli una data e una fascia oraria per procedere."
      );
    }

    const formattedDate = `${selectedDate.getDate()} ${
      MONTHS[selectedDate.getMonth()]
    } ${selectedDate.getFullYear()}`;

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "https://aiagent2000.app.n8n.cloud/webhook-test/97f80d4b-52cf-4099-b3fb-9fe81b946390",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service: selectedService.title,
            date: formattedDate,
            timeSlot: selectedTime,
            people: peopleCount,
          }),
        }
      );

      const raw = await response.text();
      let parsed: any = null;
      try {
        parsed = raw ? JSON.parse(raw) : null;
      } catch {
        parsed = null;
      }

      if (!response.ok) {
        throw new Error("Bad response");
      }

      const serverMessage =
        (parsed &&
          (parsed.message ||
            parsed.result ||
            parsed.response ||
            parsed.data ||
            parsed.text)) ||
        raw ||
        "Prenotazione confermata.";

      Alert.alert(
        "Prenotazione confermata",
        typeof serverMessage === "string"
          ? serverMessage
          : `${selectedService.title}\n${formattedDate} alle ${selectedTime}`
      );
      closeBooking();
    } catch {
      Alert.alert(
        "Errore invio",
        "Non è stato possibile inviare la prenotazione. Riprova."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={["#0A3A60", "#0F5FA8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroBadge}>
            <Ionicons name="navigate-outline" size={16} color="#0F5FA8" />
            <Text style={styles.heroBadgeText}>Marina Living</Text>
          </View>

          <Text style={styles.heroTitle}>Book Your Experience</Text>
          <Text style={styles.heroSubtitle}>
            Explore the ocean and coastline with our complimentary facilities
            and excursions.
          </Text>
        </LinearGradient>

        <View style={styles.cardsGrid}>
          {SERVICES.map((service) => (
            <Pressable
              key={service.id}
              style={styles.card}
              onPress={() => openBooking(service)}
            >
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: service.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{service.tag}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardDescription}>{service.description}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={16} color="#1E3A5F" />
                    <Text style={styles.metaText}>{service.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="people-outline" size={16} color="#1E3A5F" />
                    <Text style={styles.metaText}>{service.capacity}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedService}
        animationType="fade"
        transparent
        onRequestClose={closeBooking}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  {selectedService?.title ?? ""}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedService?.description ?? ""}
                </Text>
              </View>

              <Pressable onPress={closeBooking} hitSlop={10}>
                <Ionicons name="close" size={22} color="#0F5FA8" />
              </Pressable>
            </View>

            {selectedService && (
              <View style={styles.modalMetaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#1E3A5F" />
                  <Text style={styles.metaText}>{selectedService.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={16} color="#1E3A5F" />
                  <Text style={styles.metaText}>{selectedService.capacity}</Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionLabel}>Partecipanti</Text>
            <View style={styles.stepperRow}>
              <Pressable
                style={styles.stepperButton}
                onPress={() => setPeopleCount((prev) => Math.max(1, prev - 1))}
                hitSlop={10}
              >
                <Ionicons name="remove" size={18} color="#0F5FA8" />
              </Pressable>
              <Text style={styles.peopleValue}>{peopleCount}</Text>
              <Pressable
                style={styles.stepperButton}
                onPress={() =>
                  setPeopleCount((prev) =>
                    Math.min(getMaxCapacity(selectedService?.capacity), prev + 1)
                  )
                }
                hitSlop={10}
              >
                <Ionicons name="add" size={18} color="#0F5FA8" />
              </Pressable>
            </View>

            <Text style={styles.sectionLabel}>Select Date</Text>
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <Pressable
                  onPress={() => handleMonthChange("prev")}
                  hitSlop={12}
                  style={styles.monthButton}
                >
                  <Ionicons name="chevron-back" size={18} color="#0F5FA8" />
                </Pressable>
                <Text style={styles.monthLabel}>
                  {MONTHS[monthCursor.getMonth()]} {monthCursor.getFullYear()}
                </Text>
                <Pressable
                  onPress={() => handleMonthChange("next")}
                  hitSlop={12}
                  style={styles.monthButton}
                >
                  <Ionicons name="chevron-forward" size={18} color="#0F5FA8" />
                </Pressable>
              </View>

              <View style={styles.weekRow}>
                {WEEKDAYS.map((day) => (
                  <Text key={day} style={styles.weekday}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {calendarDays.map((day, index) => {
                  const isSelected = isSameDay(day, selectedDate);
                  return (
                    <Pressable
                      key={`${day ? day.toISOString() : "empty"}-${index}`}
                      style={[
                        styles.dayCell,
                        day ? styles.dayCellActive : styles.dayCellEmpty,
                        isSelected && styles.dayCellSelected,
                      ]}
                      onPress={() => day && setSelectedDate(day)}
                      disabled={!day}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected ? styles.dayTextSelected : {},
                          !day && styles.dayTextEmpty,
                        ]}
                      >
                        {day ? day.getDate() : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Text style={styles.sectionLabel}>Select Time</Text>
            <View style={styles.timesWrap}>
              {selectedService?.times.map((time) => {
                const isActive = time === selectedTime;
                return (
                  <Pressable
                    key={time}
                    style={[styles.timeChip, isActive && styles.timeChipActive]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        isActive ? styles.timeTextActive : {},
                      ]}
                    >
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[
                styles.confirmButton,
                isSubmitting ? styles.confirmButtonDisabled : {},
              ]}
              onPress={handleConfirm}
              disabled={isSubmitting}
            >
              <Text style={styles.confirmText}>
                {isSubmitting ? "Sending..." : "Confirm Booking"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  scroll: {
    paddingBottom: 28,
  },
  hero: {
    margin: 16,
    borderRadius: 22,
    padding: 22,
    overflow: "hidden",
    shadowColor: "#0A2745",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  heroBadge: {
    alignSelf: "center",
    backgroundColor: "#E5F1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  heroBadgeText: {
    color: "#0F5FA8",
    fontWeight: "600",
    fontSize: 13,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 20,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#0A2745",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    height: 120,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  tagChip: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 12,
  },
  tagChipText: {
    color: "#0F5FA8",
    fontWeight: "700",
    fontSize: 11,
  },
  cardContent: {
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F1C2E",
  },
  cardDescription: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#1E3A5F",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(8,12,26,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#0A2745",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F1C2E",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 2,
    lineHeight: 18,
  },
  modalMetaRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 14,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F1C2E",
    marginBottom: 8,
  },
  calendarCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F1C2E",
  },
  monthButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF4FF",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 6,
  },
  dayCellActive: {
    backgroundColor: "#F8FAFC",
  },
  dayCellEmpty: {
    backgroundColor: "transparent",
  },
  dayCellSelected: {
    backgroundColor: "#0F5FA8",
  },
  dayText: {
    fontSize: 14,
    color: "#0F1C2E",
    fontWeight: "600",
  },
  dayTextEmpty: {
    color: "transparent",
  },
  dayTextSelected: {
    color: "#FFFFFF",
  },
  timesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 14,
  },
  stepperButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  peopleValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F1C2E",
    minWidth: 28,
    textAlign: "center",
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
  },
  timeChipActive: {
    backgroundColor: "#0F5FA8",
  },
  timeText: {
    fontSize: 14,
    color: "#0F1C2E",
    fontWeight: "700",
  },
  timeTextActive: {
    color: "#FFFFFF",
  },
  confirmButton: {
    backgroundColor: "#0F5FA8",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
});
