import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
export default function PlayListScreen({ navigation }) {
  const [theme, setTheme] = useState();
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    loadThemePreference();
    loadPlaylists();
  }, []);

  const refreshScreen = () => {
    loadPlaylists();
  };
  useFocusEffect(
    React.useCallback(() => {
      refreshScreen();
    }, [])
  );

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

  const loadPlaylists = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem("playlists");
      if (storedPlaylists !== null) {
        setPlaylists(JSON.parse(storedPlaylists));
        console.log("All Playlists:", JSON.parse(storedPlaylists));
      }
    } catch (error) {
      console.error("Error loading playlists:", error);
    }
  };

  const savePlaylists = async (value) => {
    try {
      await AsyncStorage.setItem("playlists", JSON.stringify(value));
    } catch (error) {
      console.error("Error saving playlists:", error);
    }
  };

  const startStyle = {
    ...styles.startIcon,
    color: theme === "true" ? "#fff" : "#000",
  };

  const SingleListStyle = {
    ...styles.playlistButton,
    backgroundColor: theme === "true" ? "#555" : "lightblue",
  };

  const renderPlaylist = ({ item }) => (
    <View style={SingleListStyle}>
      <Pressable onPress={() => handlePlaylistPress(item)}>
        <View style={styles.song}>
          <Entypo
            name="note"
            size={24}
            style={{ ...startStyle, fontSize: 20 }}
          />
          <Text style={textStyle}>
            {item.name} ({item.movies ? item.movies.length : 0} movies)
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={() => handleDeletePlaylist(item.id)}>
        <AntDesign
          name="delete"
          size={24}
          style={{ ...startStyle, fontSize: 20 }}
        />
      </Pressable>
    </View>
  );

  const handlePlaylistPress = (playlist) => {
    navigation.navigate("SingleList", { playlist });
  };

  const handleAddPlaylist = () => {
    if (newPlaylistName.trim() !== "") {
      const existingPlaylist = playlists.find(
        (playlist) => playlist.name === newPlaylistName.trim()
      );
      if (!existingPlaylist) {
        const id = findFreeId(playlists);
        const newPlaylist = { id, name: newPlaylistName };
        setPlaylists([...playlists, newPlaylist]);
        savePlaylists([...playlists, newPlaylist]);
        setNewPlaylistName("");
      } else {
        alert("Playlist with this name already exists!");
      }
    }
  };

  const findFreeId = (playlists) => {
    const usedIds = new Set(playlists.map((playlist) => playlist.id));
    let newId = 1;
    while (usedIds.has(newId)) {
      newId++;
    }
    return newId;
  };

  const handleDeletePlaylist = (id) => {
    const updatedPlaylists = playlists.filter((playlist) => playlist.id !== id);
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);
  };

  const containerStyle = {
    ...styles.container,
    backgroundColor: theme === "true" ? "#333" : "#fff",
  };

  const buttonStyle = {
    ...styles.button,
    backgroundColor: theme === "true" ? "#555" : "lightblue",
  };

  const textStyle = {
    ...styles.text,
    color: theme === "true" ? "#fff" : "#000",
  };

  const nameStyle = {
    ...styles.name,
    color: theme === "true" ? "#fff" : "#000",
  };

  const inputStyle = {
    ...styles.input,
    color: theme === "true" ? "#fff" : "#000",
  };

  const placeStyle = {
    color: theme === "true" ? "#fff" : "#000",
  };

  return (
    <View style={containerStyle}>
      <View style={styles.bar}>
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign name="left" style={startStyle} />
        </Pressable>
        <Text style={nameStyle}>PlayLists</Text>
      </View>
      <View style={styles.all}>
        <FlatList
          data={playlists}
          renderItem={renderPlaylist}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={inputStyle}
          placeholder="Enter playlist name"
          value={newPlaylistName}
          placeholderTextColor={placeStyle.color}
          onChangeText={setNewPlaylistName}
        />
        <Pressable style={styles.buttonStyle} onPress={handleAddPlaylist}>
          <AntDesign name="plus" style={startStyle} />
        </Pressable>
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

  bar: {
    flexDirection: "row",
    paddingTop: 40,
    paddingLeft: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    minWidth: 200,
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    paddingLeft: 20,
  },
  startIcon: {
    fontSize: 35,
  },
  text: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "flex-end",
  },
  input: {
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "80%",
    marginLeft: 40,
  },
  all: {
    display: "flex",
    marginTop: 10,
  },
  playlistButton: {
    display: "flex",
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    borderRadius: 5,
    marginHorizontal: 40,
    marginTop: 10,
    width: "80%",
  },
  song: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});
