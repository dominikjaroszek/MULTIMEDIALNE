import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Entypo } from "@expo/vector-icons";

export default function SingleListScreen({ navigation, route }) {
  const [theme, setTheme] = useState(useColorScheme());
  const [page, setPage] = useState(0);
  const imagesPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showPlaylistsModal, setShowPlaylistsModal] = useState(false);
  const [data, setData] = useState([]);
  const { playlist } = route.params;
  const [tit, setTit] = useState(playlist.name);
  const handleImagePress = (item) => {
    navigation.navigate("Video", { item });
  };

  const openCategoryModal = () => {
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
  };

  const selectCategory = (categor) => {
    setSelectedCategory(categor);
    closeCategoryModal();
  };

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

  useEffect(() => {
    loadThemePreference();
    setPage(0);
    setData(playlist.movies);
  }, [searchQuery, playlist]);

  const refreshScreen = () => {
    loadThemePreference();
  };
  useFocusEffect(
    React.useCallback(() => {
      refreshScreen();
    }, [])
  );

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByCategory =
    selectedCategory !== "All"
      ? filteredData.filter((item) => item.category === selectedCategory)
      : filteredData;

  const handleDeleteVideo = async (videoIndex) => {
    try {
      const storedPlaylists = await AsyncStorage.getItem("playlists");
      if (storedPlaylists !== null) {
        let playlists = JSON.parse(storedPlaylists);

        const playlistIndex = playlists.findIndex(
          (item) => item.id === playlist.id
        );

        if (playlistIndex !== -1) {
          playlists[playlistIndex].movies.splice(videoIndex, 1);

          await AsyncStorage.setItem("playlists", JSON.stringify(playlists));
        } else {
          console.error("Playlist not found");
        }
      }
    } catch (error) {
      console.error("Error handling video deletion:", error);
    }

    const updatedPlaylist = [...data];
    updatedPlaylist.splice(videoIndex, 1);
    setData(updatedPlaylist);
  };

  const renderImages = () => {
    const start = page * imagesPerPage;
    const end = start + imagesPerPage;
    const visibleData = filteredByCategory.slice(start, end);

    return visibleData.map((item, index) => (
      <View key={index} style={styles.imagContainter}>
        <Pressable onPress={() => handleImagePress(item)}>
          <Image source={item.image} style={styles.imag} />
        </Pressable>
        <View style={styles.text}>
          <Text style={{ ...styles.textTitle, ...darkColor }}>
            {item.title}
          </Text>
          <Text style={{ ...styles.textCategory, ...darkColor }}>
            {item.category}
          </Text>
          <Text style={{ ...styles.textCategory, ...darkColor }}>
            {item.ageCategory}
          </Text>
          <Pressable
            onPress={() => handleDeleteVideo(index)}
            style={{ paddingLeft: 8 }}
          >
            <AntDesign
              name="delete"
              style={{ ...styles.basicIcon, ...darkColor }}
            />
          </Pressable>
        </View>
      </View>
    ));
  };

  const isNextDisabled = () => {
    const start = page * imagesPerPage;
    const end = start + imagesPerPage;
    return filteredData.length <= end;
  };

  const nextPage = () => {
    const totalPages = Math.ceil(filteredData.length / imagesPerPage);
    if (page < totalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const darkBack = {
    backgroundColor: theme === "true" ? "#333" : "#fff",
  };

  const darkColor = {
    color: theme === "true" ? "#fff" : "#000",
  };

  const buttonStyle = {
    backgroundColor: theme === "true" ? "#555" : "lightblue",
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
    >
      <View style={{ ...styles.container, ...darkBack }}>
        <View style={styles.backBar}>
          <View style={styles.sett}>
            <AntDesign
              name="left"
              style={{ ...styles.startIcon, ...darkColor }}
              onPress={() => navigation.goBack()}
            />
            <Text style={{ ...styles.name, ...darkColor }}>{tit}</Text>
          </View>
        </View>
        <View style={styles.drugi}>
          <TextInput
            style={{ ...styles.input, ...darkColor }}
            placeholder="Search"
            value={searchQuery}
            placeholderTextColor={darkColor.color}
            onChangeText={setSearchQuery}
          />
          <View style={styles.categorySelector}>
            <Text style={{ ...styles.text, ...darkColor }}>Sort by:</Text>
            <Pressable onPress={openCategoryModal}>
              <AntDesign
                name="down"
                style={{ ...styles.picker, ...darkColor, fontSize: 15 }}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.zdjecia}>{renderImages()}</View>

        {/* Kategorie */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCategoryModal}
          onRequestClose={closeCategoryModal}
        >
          <View style={styles.modalContainer}>
            <View style={{ ...styles.speedModal, ...darkColor, fontSize: 15 }}>
              <TouchableOpacity
                style={{ ...styles.button, ...buttonStyle }}
                onPress={() => selectCategory("All")}
              >
                <Text style={{ ...styles.text, ...darkColor }}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, ...buttonStyle }}
                onPress={() => selectCategory("Comedy")}
              >
                <Text style={{ ...styles.text, ...darkColor }}>Comedy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, ...buttonStyle }}
                onPress={() => selectCategory("Historic")}
              >
                <Text style={{ ...styles.text, ...darkColor }}>Historic</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, ...buttonStyle }}
                onPress={() => selectCategory("Drama")}
              >
                <Text style={{ ...styles.text, ...darkColor }}>Drama</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.button, ...buttonStyle }}
                onPress={closeCategoryModal}
              >
                <Text style={{ ...styles.text, ...darkColor }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {isKeyboardOpen ? (
          <Text>Ok</Text>
        ) : (
          <View style={styles.pagination}>
            <Pressable
              onPress={prevPage}
              style={{ ...styles.button, ...buttonStyle }}
            >
              <Text style={{ ...styles.text, ...darkColor }}>Previous</Text>
            </Pressable>
            <Pressable
              onPress={nextPage}
              style={{
                ...styles.button,
                ...buttonStyle,
                opacity: isNextDisabled() ? 0.5 : 1,
              }}
              disabled={isNextDisabled()}
            >
              <Text style={{ ...styles.text, ...darkColor }}>Next</Text>
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    padding: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 10,
    width: 100,
    height: 40,
  },
  pagination: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 20,
    paddingBottom: 10,
    flexShrink: 0,
  },

  text: {
    fontSize: 16,
  },
  textCategory: {
    fontSize: 12,
    paddingLeft: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  speedModal: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  textTitle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  secondBar: {
    display: "flex,",
    flexDirection: "row",
    justifyContent: "space-around",
    width: 80,
  },
  drugi: {
    display: "flex",
    flexDirection: "row",
  },
  categorySelector: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 30,
  },
  picker: {
    display: "flex",
    paddingHorizontal: 10,
    color: "white",
  },
  name: {
    fontSize: 22,
    paddingLeft: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "60%",
    marginLeft: 20,
    marginTop: 5,
  },
  backBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 80,
    paddingTop: 30,
    paddingLeft: 20,
    justifyContent: "space-between",
  },
  sett: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  backTitleText: {
    color: "#44355B",
    fontSize: 20,
    fontWeight: "bold",
  },
  startIcon: {
    fontSize: 35,
  },
  basicIcon: {
    fontSize: 25,
  },
  pickerIcon: {
    fontSize: 10,
  },
  imag: {
    height: 100,
    width: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  imagContainter: {
    display: "flex",
    flexDirection: "row",
    padding: 13,
    paddingLeft: 20,
  },
  zdjecia: {
    display: "flex",
    flex: 1,
    flexShrink: 0,
  },
});
