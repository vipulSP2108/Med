// HeaderRightIcons.js (or whatever your component file is called)

import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Colors from "./Colors";
import { View } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";

const HeaderRightIcons = () => {
    const { themeColors, toggleTheme } = useContext(ThemeContext);

    return(
  <View style={{ flexDirection: 'row', marginRight: 10 }}>
    <TouchableOpacity style={{ marginHorizontal: 5 }}>
      <Ionicons name="search-outline" size={24} color={themeColors.mainTextColor} />
    </TouchableOpacity>
    <TouchableOpacity style={{ marginHorizontal: 5 }}>
      <Ionicons name="heart-outline" size={24} color={themeColors.mainTextColor} />
    </TouchableOpacity>
    <TouchableOpacity style={{ marginHorizontal: 5 }}>
      <Ionicons name="arrow-redo-outline" size={24} color={themeColors.mainTextColor} />
    </TouchableOpacity>
  </View>
);}

export default HeaderRightIcons;
