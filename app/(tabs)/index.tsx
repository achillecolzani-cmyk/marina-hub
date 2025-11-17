import MarinaImage from "@/assets/images/marina.png";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
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

// --- Menu items ---
const menuItems = [
  { id: "chatbot", href: "/chatbot", text: "Chatbot", emoji: "💬" },
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
        android_ripple={{ color: "rgba(255,255,255,0.08)" }}
        accessibilityRole="button"
        accessibilityLabel={text}
        style={({ pressed }) => [
          styles.buttonOuter,
          pressed ? { opacity: 0.9, transform: [{ scale: 0.96 }] } : {},
        ]}
      >
        <LinearGradient
          // Darker edges, lighter center for glass depth
          colors={[
            "rgba(4, 18, 52, 0.95)",
            "rgba(40, 112, 190, 0.55)",
            "rgba(4, 18, 52, 0.95)",
          ]}
          locations={[0, 0.52, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonInner}
        >
          <Text style={styles.buttonIcon} accessible={false}>
            {emoji}
          </Text>
          <Text style={styles.buttonText}>{text}</Text>

          {/* Subtle shine on bottom-right border */}
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.0)",
              "rgba(255,255,255,0.22)",
            ]}
            start={{ x: 0.4, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={styles.buttonCornerHighlight}
          />
        </LinearGradient>
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

        <LinearGradient
          colors={[
            "rgba(0,0,0,0.50)",
            "rgba(0,0,0,0.18)",
            "rgba(255,255,255,0.08)",
          ]}
          locations={[0, 0.55, 1]}
          style={styles.overlay}
        />

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Marina Hub</Text>
          </View>

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
    flex: 1,
    backgroundColor: "#020514",
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "flex-end",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 1,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  pressableItem: {
    width: "47%",
    height: 120,
    borderRadius: 26,
    marginBottom: 12,
    overflow: "hidden",
  },
  buttonInner: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.32)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.42,
    shadowRadius: 26,
    elevation: 8,
  },
  buttonOuter: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 26,
    overflow: "hidden",
  },
  buttonCornerHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 26,
    opacity: 0.9,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 6,
    lineHeight: 36,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
    minHeight: 40,
    margin: 0,
  },
});
