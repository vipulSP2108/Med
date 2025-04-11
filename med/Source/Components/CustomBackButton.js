import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Colors from "./Colors";
import { ThemeContext } from "../Context/ThemeContext";
import { useContext } from "react";

export default CustomBackButton = () => {
    const { themeColors, toggleTheme } = useContext(ThemeContext);

    const navigation = useNavigation();
    return (
        <TouchableOpacity className='px-4' onPress={() => navigation.goBack()} >
            <Ionicons name="arrow-back" size={24} color={themeColors.mainTextColor}  />
        </TouchableOpacity>
    );
};