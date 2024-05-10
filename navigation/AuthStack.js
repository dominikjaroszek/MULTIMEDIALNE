import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../views/Home";
import VideoScreen from "../views/Video";
import SettingsScreen from "../views/Settings";
import PlayListScreen from "../views/PlayList";
import InfoScreen from "../views/Info";
import SingleListScreen from "../views/SingleList";
const Stack = createNativeStackNavigator();

export default function AuthStackNav() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Video" component={VideoScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PlayList" component={PlayListScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
      <Stack.Screen name="SingleList" component={SingleListScreen} />
    </Stack.Navigator>
  );
}
