import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { iconConfig } from '../Data/iconConfig'; // Importing the iconConfig

const FoodTypeIcon = ({ type, size, padding, textShow }) => {
  const { label, iconName, bgColor, iconColor } = iconConfig[type] || {};

  return (
    <View className={`mr-1 flex-row items-center ${bgColor}`} style={{ borderRadius: 4, paddingHorizontal: padding }}>
      {textShow && <Text>{label} </Text>}
      <Ionicons name={iconName} size={size} color={iconColor} />
    </View>
  );
};

export default FoodTypeIcon;
