import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Components/Colors';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { ThemeContext } from '../Context/ThemeContext';

export default SearchInput = ({ }) => {
      const { themeColors, toggleTheme } = useContext(ThemeContext);
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {segregatedDataList, setSegregatedDataList } = useContext(GlobalStateContext); 
  const [campusMenu, setCampusMenu] = useState([]);
  const [value, setValue] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isFocused && value === '') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, value]);

  useEffect(() => {
    setCampusMenu(segregatedDataList.map(item => item.name));

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % segregatedDataList.length);
    }, 3000); // Change every 3 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, []);
  
  return (
    <View className='searchInputTxt rounded-xl w-full text-base px-3' style={{ backgroundColor: themeColors.secComponentColor, justifyContent:'center', height: Dimensions.get('window').height * 0.07}}>
      <Ionicons
        color={themeColors.diffrentColorOrange}
        name="search"
        size={24}
        style={styles.icon}
      />
      {!isFocused && (
        <View className='w-10/12' style={styles.placeholderContainer}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={[{ color: themeColors.textColor}]}>
            Search "{campusMenu.length > 0 ? campusMenu[currentIndex] : ''}"
          </Text>
        </View>
      )}
      {/* <TextInput 
        style={[styles.textInput, { numberOfLines:3, ellipsizeMode:'tail', backgroundColor: themeColors.secComponentColor, paddingLeft: 40 }]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={value}
        onChangeText={setValue}
        placeholder={`Search "${campusMenu[currentIndex]}"`}
        placeholderTextColor={themeColors.textColor}
      /> */}
    </View>
  );
};

const styles = {
  // textInput: {
  //   flex: 1,
  //   height: '100%',
  //   fontSize: 16,
  //   color: themeColors.textColor,
  // },
  icon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  placeholderContainer: {
    position: 'absolute',
    left: 50,
    flexDirection: 'row',
    zIndex: 1,
  },
  placeholderContainer: {
    position: 'absolute',
    left: 40,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  // container: {
  //   position: 'relative',
  //   width: '83%',
  //   height: 60,
  //   justifyContent: 'center',
  // },
  // textInput: {
  //   flex: 1,
  //   paddingLeft: 60, // Padding to make space for the icon
  //   fontSize: 16,
  //   borderRadius: 15,
  // },
  // placeholderText: {
  //   // fontSize: 18,
  //   // color: 'grey',
  // },
  // animatedText: {
  //   // fontSize: 18,
  //   // color: 'grey',
  // },
};