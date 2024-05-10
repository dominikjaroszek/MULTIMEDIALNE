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
import { AntDesign } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [theme, setTheme] = useState(useColorScheme());
  const [page, setPage] = useState(0);
  const imagesPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [showPlaylistsModal, setShowPlaylistsModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [video, setVideo] = useState();

  const data = [
    {
      title: "Big Buck Bunny",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      image: require("./../assets/inter.jpg"),
      category: "Animation",
      ageCategory: "For Children",
      description:
        "Big Buck Bunny is a short animated film about a giant rabbit with a heart as big as his ears. Follow his adventures in the lush green fields as he tries to outwit his foes.",
    },
    {
      title: "Elephant Dream",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      image: require("./../assets/diuna.jpg"),
      category: "Animation",
      ageCategory: "For Children",
      description:
        "Elephant Dream takes you on a journey through the imaginative world of elephants. Join them as they navigate through dreamscapes and surreal landscapes.",
    },
    {
      title: "For Bigger Blazes",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      image: require("./../assets/carbon.jpg"),
      category: "Animation",
      ageCategory: "For Teens",
      description:
        "For Bigger Blazes is an animated adventure filled with action and suspense. Join the brave characters as they battle against formidable odds to save their world.",
    },
    {
      title: "For Bigger Escape",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      image: require("./../assets/bad.jpg"),
      category: "Comedy",
      ageCategory: "For Teens",
      description:
        "For Bigger Escape is a hilarious comedy about a group of friends who embark on a wild escapade. Get ready for non-stop laughs and unexpected twists!",
    },
    {
      title: "For Bigger Joyrides",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      image: require("./../assets/saul.jpg"),
      category: "Historic",
      ageCategory: "For Adults",
      description:
        "For Bigger Joyrides takes you on a thrilling ride through history. Experience the excitement and danger as characters embark on epic journeys.",
    },
    {
      title: "Subaru Outback On Street",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      image: require("./../assets/titanic.png"),
      category: "Historic",
      ageCategory: "For Adults",
      description:
        "Subaru Outback On Street is a gripping historical drama set in the streets of a bustling city. Follow the characters as they navigate through love, loss, and betrayal.",
    },
    {
      title: "Tears of Steel",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      image: require("./../assets/wither.jpg"),
      category: "Drama",
      ageCategory: "For Adults",
      description:
        "Tears of Steel is an emotional rollercoaster that explores the depths of human emotions. Get ready for tears, laughter, and everything in between.",
    },
    {
      title: "We Are Going On Bullrun",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      image: require("./../assets/catch.jpg"),
      category: "Drama",
      ageCategory: "For Adults",
      description:
        "We Are Going On Bullrun is a gripping drama that delves into the complexities of human relationships. Follow the characters as they navigate through love, betrayal, and redemption.",
    },
  ];

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

  const loadPlaylist = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem("playlists");
      if (storedPlaylists !== null) {
        setPlaylists(JSON.parse(storedPlaylists));
      }
    } catch (error) {
      console.error("Error loading Playlist:", error);
    }
  };

  useEffect(() => {
    const loadThemeAndPlaylists = async () => {
      try {
        await loadThemePreference();

        await loadPlaylist();
      } catch (error) {
        console.error("Error loading data:", error);
      }

      setPage(0);
    };

    loadThemeAndPlaylists();
  }, [searchQuery]);

  const refreshScreen = () => {
    loadThemePreference();
    loadPlaylist();
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

  const openPlaylistsModal = (item) => {
    setVideo(item);
    setShowPlaylistsModal(true);
  };

  const closePlaylistsModal = () => {
    setShowPlaylistsModal(false);
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
            onPress={() => openPlaylistsModal(item)}
            style={{ paddingLeft: 10 }}
          >
            <AntDesign
              name="hearto"
              style={{ ...styles.basicIcon, ...darkColor }}
            />
          </Pressable>
        </View>
      </View>
    ));
  };

  const selectPlaylist = (playlistName) => {
    setSelectedPlaylist(playlistName);
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

  const goToSettScreen = () => {
    navigation.navigate("Settings");
  };

  const handleAddToPlaylist = async () => {
    try {
      const storedPlaylists = await AsyncStorage.getItem("playlists");

      let playlists = [];
      if (storedPlaylists !== null) {
        playlists = JSON.parse(storedPlaylists);
      }

      if (selectedPlaylist && playlists) {
        const updatedPlaylists = playlists.map((playlist) => {
          if (playlist.name === selectedPlaylist) {
            if (!playlist.movies) {
              playlist.movies = [];
            }
            const isDuplicate = playlist.movies.some(
              (movie) => movie.title === video.title
            );
            if (!isDuplicate) {
              playlist.movies.push(video);
            }
          }
          return playlist;
        });
        await AsyncStorage.setItem(
          "playlists",
          JSON.stringify(updatedPlaylists)
        );
        closePlaylistsModal();
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
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
              name="youtube"
              style={{ ...styles.startIcon, ...darkColor }}
            />
            <Text style={{ ...styles.name, ...darkColor }}>VideoPlayer</Text>
          </View>
          <View style={styles.secondBar}>
            <Pressable onPress={goToSettScreen}>
              <AntDesign
                name="setting"
                style={{ ...styles.basicIcon, ...darkColor }}
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate("PlayList")}>
              <AntDesign
                name="profile"
                style={{ ...styles.basicIcon, ...darkColor }}
              />
            </Pressable>
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

        {/* Playlists */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPlaylistsModal}
        >
          <View style={styles.modalContainer}>
            <View style={{ ...styles.speedModal, ...darkColor, fontSize: 15 }}>
              <TouchableOpacity style={{ ...styles.button, ...buttonStyle }}>
                <Text style={{ ...styles.text, ...darkColor }}>Playlists:</Text>
              </TouchableOpacity>
              {playlists.map((playlist, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ ...styles.button, ...buttonStyle, width: "auto" }}
                  onPress={() => selectPlaylist(playlist.name)}
                >
                  <Text style={{ ...styles.text, ...darkColor }}>
                    {playlist.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <View style={styles.pas}>
                <TouchableOpacity
                  style={{ ...styles.button, ...buttonStyle }}
                  onPress={handleAddToPlaylist}
                >
                  <Text style={{ ...styles.text, ...darkColor }}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.button, ...buttonStyle }}
                  onPress={closePlaylistsModal}
                >
                  <Text style={{ ...styles.text, ...darkColor }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  pas: {
    display: "flex",
    flexDirection: "row",
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
    paddingLeft: 20,
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
    paddingRight: 10,
    justifyContent: "space-between",
  },
  sett: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
