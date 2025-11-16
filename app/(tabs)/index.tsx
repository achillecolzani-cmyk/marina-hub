import MarinaImage from "@/assets/images/marina.png";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// --- Fonts ---
const Fonts = {
  rounded:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

// --- Menu items ---
const menuItems = [
  { id: "chatbot", href: "/", text: "Chatbot", emoji: "💬" },
  { id: "porte", href: "/apertura-porte", text: "Apertura Porte", emoji: "🔓" },
  { id: "marina", href: "/marina", text: "Marina", emoji: "🌊" },
  {
    id: "segnala",
    href: "/segnala-manutenzione",
    text: "Segnala Problema",
    emoji: "⚠️",
  },
];

// --- MenuButton component ---
interface MenuButtonProps {
  href: string;
  text: string;
  emoji: string;
  router: ReturnType<typeof useRouter>;
  index: number;
}

function MenuButton({ href, text, emoji, router, index }: MenuButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const anim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  Animated.timing(anim, {
    toValue: 1,
    duration: 420,
    delay: index * 80 + 120,
    useNativeDriver: true,
    easing: Easing.out(Easing.cubic),
  }).start();

  const onPressIn = () => {
    if (Platform.OS === "android") {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    Animated.spring(scale, {
      toValue: 0.975,
      useNativeDriver: true,
      friction: 8,
      tension: 200,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 200,
    }).start();
  };

  const backgroundColor = isHovered ? "#007AFF" : "#F5F5F5";
  const color = isHovered ? "#FFFFFF" : "#000000";

  return (
    <Animated.View
      style={[
        styles.pressableItem,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              }),
            },
            { scale: scale },
          ],
        },
      ]}
    >
      <Pressable
        onPress={() => router.push(href)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        android_ripple={{ color: "rgba(0,0,0,0.06)" }}
        accessibilityRole="button"
        accessibilityLabel={text}
        style={({ pressed }) => [
          styles.buttonInner,
          {
            backgroundColor: pressed
              ? "rgba(0, 122, 255, 0.10)"
              : isHovered
              ? "rgba(0, 122, 255, 0.08)"
              : backgroundColor,
          },
          pressed ? { opacity: 0.94, transform: [{ scale: 0.96 }] } : {},
        ]}
      >
        <Text style={[styles.buttonIcon, { color }]} accessible={false}>
          {emoji}
        </Text>
        <Text style={[styles.buttonText, { color }]}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
}

// --- Main Dashboard ---
export default function DashboardScreen() {
  const router = useRouter();
  const isWide = SCREEN_WIDTH > 760;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.parallaxContainer}>
        <Image
          source={MarinaImage}
          style={styles.headerImage}
          resizeMode="cover"
        />

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Marina Hub</Text>
          </View>

          <Text style={styles.subtitle}>Seleziona un servizio</Text>

          <View
            style={[
              styles.menuContainer,
              isWide ? { justifyContent: "space-between" } : {},
            ]}
          >
            {menuItems.map((item, i) => (
              <MenuButton
                key={item.id}
                href={item.href}
                text={item.text}
                emoji={item.emoji}
                router={router}
                index={i}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  parallaxContainer: {
    fontFamily: Fonts.rounded,
    backgroundColor: "#FFFFFF",
    minHeight: "100%",
    flex: 1,
  },
  headerImage: {
    width: "100%",
    height: 300,
  },
  contentContainer: {
    padding: 24,
    marginTop: -60,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.06)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8 as any,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: Fonts.rounded,
    margin: 0,
    color: "#000000",
  },
  subtitle: {
    fontSize: 18,
    color: "#8A8A8E",
    marginTop: 8,
    marginBottom: 24,
    fontFamily: Fonts.rounded,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  pressableItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  buttonInner: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 12,
    lineHeight: 36,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    minHeight: 40,
    margin: 0,
  },
});
