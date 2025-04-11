import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../Components/Navbar";
import { ThemeContext } from "../Context/ThemeContext";
import TextStyles from "../Style/TextStyles";

const MedicalHomeScreen = () => {
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const fontstyles = TextStyles();

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const today = new Date();
    const nextDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return {
        day: date.toLocaleString("en-US", { weekday: "short" }),
        date: date.getDate().toString().padStart(2, "0"),
      };
    });
    setDates(nextDates);
    setSelectedDate(nextDates[0].date); // Select today's date by default
  }, []);

  const services = [
    // { id: "1", name: "Covid-19", icon: "medkit-outline", screen: null },
    { id: "2", name: "Doctors", icon: "person-circle-outline", screen: "DoctorsScreen" },
    { id: "3", name: "Hospitals", icon: "business-outline", screen: "HospitalsScreen" },
    // { id: "4", name: "Medicines", icon: "capsule-outline", screen: null },
  ];

  const doctorsCategory = [
    { id: "2", name: "Gynecologist", icon: "👱‍♀️", screen: null },
    { id: "3", name: "Physician", icon: "🩺", screen: null },
    { id: "4", name: "Physiotherapist", icon: "🦿", screen: null },
    { id: "5", name: "Psychiatrist", icon: "🧠", screen: null },
];

  const appointments = [
    {
      id: "1",
      doctorName: "Dr. Samuel Johnson",
      specialization: "Pediatrician",
      date: "Monday, Jul 11 at 4:00 - 5:00",
      image: "https://via.placeholder.com/50", // Replace with actual doctor image URL
    },
    {
      id: "2",
      doctorName: "Dr. Amanda Brown",
      specialization: "Dermatologist",
      date: "Wednesday, Jul 13 at 2:30 - 3:30",
      image: "https://via.placeholder.com/50",
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: themeColors.backGroundColor }}>
      {/* Header */}
      <View className=' pb-4' style={{ backgroundColor: themeColors.diffrentColorPerpleBG }}>
        <Navbar />
        <View className='px-4 pt-16 flex-row'>
          <View className='items-start justify-center pb-4'>
            <View className='flex-row'>
              <Text style={[fontstyles.h1, { color: themeColors.mainTextColor }]}>Your Health,</Text>
            </View>
            <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor }]}>Simplified</Text>
          </View>
          <Image
            // style={{ height: 150,  }}
            className=' h-36 absolute right-0 bottom-0'
            source={require('../assets/images/doctor/doctorhomepage.png')}
            resizeMode="contain" // or "cover", depending on the desired effect
          />
        </View>

        <View className=' mx-4 flex-row rounded-lg items-center px-2 py-1 justify-between' style={{ backgroundColor: themeColors.backGroundColor }}>
          <TextInput placeholder="Search..." />
          <Ionicons name="search-outline" size={20} color="gray" />
        </View>
      </View>

      {/* Doctors Section */}
      <View className=' pt-4 px-4' style={{ backgroundColor: themeColors.backGroundColor }}>
        {/* <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>SPECIALITY</Text>
          <Text style={{ color: "#3BA8C6", fontWeight: "bold" }}>SEE ALL</Text>
        </View> */}

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={doctorsCategory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('DoctorsScreen', { searchQuery: item.name })}
              style={{ alignItems: "center", marginRight: 25 }}
            >
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: themeColors.componentColor, justifyContent: "center", alignItems: "center" }}>
              <Text className=' text-3xl'>{item.icon}</Text>
                {/* <Ionicons name={item.icon} size={28} color="#3BA8C6" /> */}
              </View>
              <Text className=' flex-wrap' style={{ marginTop: 5 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Services Section */}
      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Services for you</Text>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => item.screen && navigation.navigate(item.screen)}
              style={{ alignItems: "center", marginRight: 25 }}
            >
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#D9F3F7", justifyContent: "center", alignItems: "center" }}>
                <Ionicons name={item.icon} size={28} color="#3BA8C6" />
              </View>
              <Text style={{ marginTop: 5 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>      

    </ScrollView>
  );
};

export default MedicalHomeScreen;