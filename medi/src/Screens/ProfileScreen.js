import React from "react";
import { View, Text, FlatList, Image, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../Context/ThemeContext";
import { darkTheme, lightTheme } from "../Constants/theme";
import Fa6Icon from "react-native-vector-icons/FontAwesome6"; // Corrected import

// Sample data
const teachers = [{ id: "1", name: "Vipul Patil", avatar: "https://via.placeholder.com/50" }];
const students = [
  { id: "2", name: "Piyush Vishwakarma", avatar: "https://via.placeholder.com/50" },
  { id: "3", name: "Vipul Patil", avatar: "https://via.placeholder.com/50" },
  { id: "4", name: "John Doe", avatar: "https://via.placeholder.com/50" },
  { id: "5", name: "Jane Smith", avatar: "https://via.placeholder.com/50" },
];

const PeopleScreen = () => {
  const { theme } = useTheme();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={[styles.text, { color: currentTheme.color }]}>{item.name}</Text>
      <Fa6Icon name="ellipsis-vertical" size={22} color={currentTheme.color} style={styles.headerIcon} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.itemContainer}>
          <Text style={[styles.header, { color: currentTheme.color }]}>Teachers</Text>
          <Fa6Icon name="user-plus" size={22} color={currentTheme.color} style={styles.icon} />
        </View>
        <View style={styles.underline} />
        <FlatList data={teachers} renderItem={renderItem} keyExtractor={(item) => item.id} scrollEnabled={false} />

        <View style={styles.itemContainer}>
          <Text style={[styles.header, { color: currentTheme.color }]}>Students</Text>
          <Fa6Icon name="user-plus" size={22} color={currentTheme.color} style={[styles.icon, {marginRight: 10}]} />
          <Fa6Icon name="ellipsis-vertical" size={22} color={currentTheme.color} style={[styles.headerIcon]} />
        </View>
        <View style={styles.underline} />
        <FlatList data={students} renderItem={renderItem} keyExtractor={(item) => item.id} scrollEnabled={false} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerIcon: {
    marginHorizontal: 15, // Adds some spacing between text and icon
  },
  underline: {
    height: 2,
    backgroundColor: "#ccc",
    marginBottom: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  icon: {
    marginLeft: "auto",
  },
});

export default PeopleScreen;
