import React, { useState, useEffect } from "react";
import { View, Switch, StyleSheet, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const SettingsScreen = ({ navigation }) => {
  const [theme, setTheme] = useState(0);

  const loadDarkModePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("theme");
      console.log(storedTheme);
      if (storedTheme !== null) {
        setTheme(JSON.parse(storedTheme));
        console.log(theme);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };
  const containerStyle = {
    ...styles.container,
    backgroundColor: theme === true ? "#333" : "#fff",
  };

  const saveDarkModePreference = async (value) => {
    try {
      console.log(value);
      await AsyncStorage.setItem("theme", JSON.stringify(value));
    } catch (error) {
      console.error("Error saving dark mode preference:", error);
    }
  };

  useEffect(() => {
    loadDarkModePreference();
  }, [theme]);

  const toggleSwitch = (value) => {
    console.log(value);
    setTheme(value);
    saveDarkModePreference(value);
  };

  const darkBack = {
    backgroundColor: theme === true ? "#333" : "#fff",
  };

  const darkColor = {
    color: theme === true ? "#fff" : "#000",
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
        <Text style={{ ...styles.name, ...darkColor }}>Settings</Text>
      </View>
      <View style={styles.body}>
        <Text style={{ ...styles.text, ...darkColor }}>
          Ustawienia motywu light/dark
        </Text>
        <View style={styles.swi}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={theme ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={theme}
          />
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.body2}>
        <Text style={{ ...styles.text, ...darkColor }}>
          Informacje o aplikacji
        </Text>
        <Pressable onPress={() => navigation.navigate("Info")}>
          <AntDesign
            name="export"
            style={{ ...styles.standardIcon, ...darkColor }}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    display: "flex",
  },
  swi: {
    paddingTop: 10,
    paddingLeft: 10,
  },
  startIcon: {
    fontSize: 35,
  },
  standardIcon: {
    fontSize: 20,
  },
  bar: {
    flexDirection: "row",
    paddingTop: 40,
    paddingLeft: 10,
  },
  name: {
    fontSize: 22,
    paddingLeft: 20,
  },

  text: {
    fontSize: 20,
    paddingLeft: 20,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: 20,
    paddingBottom: 15,
  },
  body2: {
    paddingTop: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default SettingsScreen;
