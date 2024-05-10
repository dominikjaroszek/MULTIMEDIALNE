import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  useColorScheme,
  Pressable,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
export default function VideoScreen({ navigation }) {
  const [theme, setTheme] = useState(useColorScheme());
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const route = useRoute();
  const item = route.params?.item;
  const [url, setURL] = useState(item.url);

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const downloadFromUrl = async () => {
    const filename = item.title;
    try {
      setLoading(true);
      const result = await FileSystem.downloadAsync(
        item.url,
        FileSystem.documentDirectory + filename
      );

      await save(result.uri, filename, result.headers["Content-Type"]);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const save = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };

  const openSpeedModal = () => {
    setShowSpeedModal(true);
  };

  const closeSpeedModal = () => {
    setShowSpeedModal(false);
  };

  const selectSpeed = (speed) => {
    setSpeed(speed);
    video.current.setRateAsync(speed, true);
    closeSpeedModal();
  };

  const toggleSlider = (value) => {
    setVolume(value);
  };

  const toggleMute = () => {
    video.current.getStatusAsync().then((status) => {
      video.current.setVolumeAsync(isMuted ? 1 : 0);
      setIsMuted(!isMuted);
    });
  };

  const toggleLooping = () => {
    setIsLooping(!isLooping);
  };

  const skipBackward = async () => {
    const status = await video.current.getStatusAsync();
    const newPosition = Math.max(0, status.positionMillis - 5000);
    video.current.setPositionAsync(newPosition);
  };

  const skipForward = async () => {
    const status = await video.current.getStatusAsync();
    const duration = await video.current.getStatusAsync();
    const newPosition = Math.min(
      duration.durationMillis,
      status.positionMillis + 5000
    );
    video.current.setPositionAsync(newPosition);
  };

  const loadThemePreference = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem("theme");
      console.log(storedTheme);
      if (storedTheme !== null) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  useEffect(() => {
    loadThemePreference();
  }, []);

  const darkBack = {
    backgroundColor: theme === "true" ? "#333" : "#fff",
  };

  const darkColor = {
    color: theme === "true" ? "#fff" : "#000",
  };

  const buttonStyle = {
    backgroundColor: theme === "true" ? "#555" : "lightblue",
  };

  const downloadingText = loading ? (
    <AntDesign name="loading1" style={{ ...styles.startIcon, ...darkColor }} />
  ) : (
    <AntDesign name="download" style={{ ...styles.startIcon, ...darkColor }} />
  );

  return (
    <View style={{ ...styles.container, ...darkBack }}>
      <View style={styles.bar}>
        <Pressable onPress={() => navigation.goBack()}>
          <AntDesign
            name="left"
            style={{ ...styles.startIcon, ...darkColor }}
          />
        </Pressable>
        <Text style={{ ...styles.name, ...darkColor }}>Video</Text>
      </View>

      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: url,
        }}
        useNativeControls
        resizeMode={isLandscape ? "cover" : "contain"}
        isLooping={isLooping}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        volume={volume}
        rate={speed}
      />

      <View style={styles.buttons}>
        <Pressable
          style={{ ...styles.button, ...buttonStyle }}
          onPress={skipBackward}
        >
          <AntDesign
            name="banckward"
            style={{ ...styles.startIcon, ...darkColor }}
          />
        </Pressable>
        <Pressable
          style={{ ...styles.button, ...buttonStyle }}
          onPress={() => {
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync();
          }}
        >
          {status.isPlaying ? (
            <AntDesign
              name="pause"
              style={{ ...styles.startIcon, ...darkColor }}
            />
          ) : (
            <AntDesign
              name="caretright"
              style={{ ...styles.startIcon, ...darkColor }}
            />
          )}
        </Pressable>

        <Pressable
          style={{ ...styles.button, ...buttonStyle }}
          onPress={skipForward}
        >
          <AntDesign
            name="forward"
            style={{ ...styles.startIcon, ...darkColor }}
          />
        </Pressable>

        <View style={styles.buttons}>
          <Pressable
            style={{ ...styles.button, ...buttonStyle }}
            onPress={() => toggleVolumeSlider()}
          >
            <Entypo
              name="sound-mix"
              style={{ ...styles.startIcon, ...darkColor }}
            />
          </Pressable>
          <Pressable
            style={{ ...styles.button, ...buttonStyle }}
            onPress={toggleMute}
          >
            <Text style={{ ...styles.text, ...darkColor }}>
              {isMuted ? (
                <Entypo
                  name="sound"
                  style={{ ...styles.startIcon, ...darkColor }}
                />
              ) : (
                <Entypo
                  name="sound-mute"
                  style={{ ...styles.startIcon, ...darkColor }}
                />
              )}
            </Text>
          </Pressable>

          <Pressable
            style={{ ...styles.button, ...buttonStyle }}
            onPress={toggleLooping}
          >
            <Text style={{ ...styles.text, ...darkColor }}>
              {isLooping ? (
                <Ionicons
                  name="return-down-forward"
                  style={{ ...styles.startIcon, ...darkColor }}
                />
              ) : (
                <Ionicons
                  name="repeat"
                  style={{ ...styles.startIcon, ...darkColor }}
                />
              )}
            </Text>
          </Pressable>
          <Pressable
            style={{ ...styles.button, ...buttonStyle }}
            onPress={openSpeedModal}
          >
            <Ionicons
              name="speedometer"
              style={{ ...styles.startIcon, ...darkColor }}
            />
          </Pressable>
          <Pressable
            onPress={downloadFromUrl}
            style={{ ...styles.button, ...buttonStyle }}
            disabled={loading}
          >
            <Text style={{ ...styles.text, ...darkColor }}>
              {downloadingText}
            </Text>
          </Pressable>
        </View>
        {showVolumeSlider && (
          <Slider
            style={{ width: "80%", marginTop: 20 }}
            minimumValue={0}
            maximumValue={1}
            vertical
            value={volume}
            onValueChange={(value) => toggleSlider(value)}
          />
        )}

        <View style={styles.description}>
          <Text style={{ ...styles.text, ...darkColor, paddingBottom: 10 }}>
            Description:
          </Text>

          <Text style={{ ...styles.text, ...darkColor, textAlign: "justify" }}>
            {item.description}
          </Text>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSpeedModal}
        onRequestClose={closeSpeedModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.speedModal}>
            <TouchableOpacity
              style={{ ...styles.button, ...buttonStyle }}
              onPress={() => selectSpeed(0.5)}
            >
              <Text style={{ ...styles.text, ...darkColor }}>0.5x</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, ...buttonStyle }}
              onPress={() => selectSpeed(1.0)}
            >
              <Text style={{ ...styles.text, ...darkColor }}>1.0x</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, ...buttonStyle }}
              onPress={() => selectSpeed(1.5)}
            >
              <Text style={{ ...styles.text, ...darkColor }}>1.5x</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, ...buttonStyle }}
              onPress={() => selectSpeed(2.0)}
            >
              <Text style={{ ...styles.text, ...darkColor }}>2.0x</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, ...buttonStyle }}
              onPress={closeSpeedModal}
            >
              <Text style={{ ...styles.text, ...darkColor }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  video: {
    alignSelf: "center",
    width: 370,
    height: 300,
    borderRadius: 5,
  },
  name: {
    fontSize: 22,
    paddingLeft: 20,
  },
  videoFullscreen: {
    ...StyleSheet.absoluteFillObject,
  },
  description: {
    paddingTop: 20,
    marginHorizontal: 20,
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  speedModal: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  speedButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  speedButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#FF5733",
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});
