import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
export default function InfoScreen({ navigation }) {
  const [theme, setTheme] = useState(useColorScheme());

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme !== null) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  const darkBack = {
    backgroundColor: theme === "true" ? "#333" : "#fff",
  };

  const darkColor = {
    color: theme === "true" ? "#fff" : "#000",
  };

  return (
    <View style={{ ...styles.container, ...darkBack }}>
      <View style={styles.bar}>
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign
            name="left"
            style={{ ...styles.startIcon, ...darkColor }}
          />
        </Pressable>
        <Text style={{ ...styles.name, ...darkColor }}>Info</Text>
      </View>
      <View style={styles.sciana}>
        <Text style={{ ...styles.text, ...darkColor }}>
          Aplikacja VideoPlayer to intuicyjne narzędzie do przeglądania i
          odtwarzania filmów wideo na urządzeniach mobilnych. Dzięki niej
          użytkownicy mogą łatwo przeglądać bibliotekę filmów, wybierając filmy
          na podstawie różnych kategorii, takich jak gatunek, grupa wiekowa itp.
          Aplikacja umożliwia także wyszukiwanie filmów za pomocą wbudowanego
          pola wyszukiwania.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  startIcon: {
    fontSize: 35,
  },
  bar: {
    flexDirection: "row",
    paddingTop: 40,
    paddingLeft: 20,
  },
  name: {
    fontSize: 22,
    paddingLeft: 20,
  },
  text: {
    fontSize: 18,
    paddingTop: 10,
    textAlign: "justify",
    marginHorizontal: 25,
  },
});
