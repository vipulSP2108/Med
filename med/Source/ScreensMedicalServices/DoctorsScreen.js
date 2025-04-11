import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../Context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DoctorsScreen = ({ route }) => {
    const navigation = useNavigation();
    const [search, setSearch] = useState(route.params?.searchQuery || '');
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const { doctorData, setDoctorData } = useContext(GlobalStateContext);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [offdayDoctors, setOffdayDoctors] = useState([]);
    const [onLeaveDoctors, setOnLeaveDoctors] = useState([]);

    useEffect(() => {
        const today = new Date();
        const nextDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() + i);
            return {
                datefull: date,
                day: date.toLocaleString("en-US", { weekday: "short" }),
                date: date.getDate().toString().padStart(2, "0"),
            };
        });
        setDates(nextDates);
        setSelectedDate(nextDates[0]); // Select today's date by default
    }, []);

    useEffect(() => {
        if (selectedDate && search.trim() !== '') {
            filterDoctors(selectedDate, search);
        } else if (selectedDate) {
            filterDoctors(selectedDate); // When there is no search input, just filter by date
        }
    }, [selectedDate, doctorData, search]);

    const filterDoctors = (selectedDate, searchQuery = '') => {
        const formattedSelectedDate = new Date(selectedDate.datefull).toLocaleString("en-US", { weekday: 'long' });

        const available = [];
        const offday = [];
        const onLeave = [];

        doctorData.forEach((doctor) => {
            const selected = new Date(selectedDate.datefull).toLocaleDateString();
            const doctorOffDays = doctor.OffDays.map(day => day.toLowerCase());
            const doctorLeaveDates = doctor.OffDates.map(date => new Date(date).toLocaleDateString());

            // Filtering by Doctor Name and Specialization
            const isDoctorMatch = doctor.DoctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doctor.Specialization.toLowerCase().includes(searchQuery.toLowerCase());

            if (isDoctorMatch) {
                if (doctorLeaveDates.includes(selected)) {
                    onLeave.push(doctor);
                } else if (doctorOffDays.includes(formattedSelectedDate.toLowerCase())) {
                    offday.push(doctor);
                } else {
                    available.push(doctor);
                }
            }
        });

        setAvailableDoctors(available);
        setOffdayDoctors(offday);
        setOnLeaveDoctors(onLeave);
    };


    const renderDoctor = ({ item }) => {
        // Check if the doctor is available, on leave, or on offday
        const isAvailable = availableDoctors.some(doctor => doctor.DoctorName === item.DoctorName);
        const isOnLeave = onLeaveDoctors.some(doctor => doctor.DoctorName === item.DoctorName);
        const isOffDay = offdayDoctors.some(doctor => doctor.DoctorName === item.DoctorName);

        // Handle doctor's leave and off day information
        const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        let leaveMessage = '';
        if (isOnLeave) {
            const lastLeaveDate = item.OffDates[item.OffDates.length - 1];
            const lastLeave = new Date(lastLeaveDate);
            lastLeave.setDate(lastLeave.getDate() + 1);
            leaveMessage = `On leave, back on ${lastLeave.toLocaleDateString()}.`;

        }

        let offDayMessage = '';
        if (isOffDay) {
            const offDays = item.OffDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", "); // Capitalize the first letter of each day
            const lastOffDay = item.OffDays[item.OffDays.length - 1];

            // Find the index of the last off day in the 'Days' array
            const lastOffDayIndex = Days.indexOf(lastOffDay);

            // Calculate the next day (the day after the last off day)
            const nextBackIndex = (lastOffDayIndex + 1) % Days.length; // Use modulo to wrap around if it’s Sunday
            const nextBackDay = Days[nextBackIndex];

            offDayMessage = `Off today, back on ${nextBackDay} \n (Off Days: ${offDays}).`; // Use the nextBackDay to specify the return day
        }

        return (
            <View style={{ backgroundColor: themeColors.backGroundColor }} className=' flex-row p-3 mb-2'>
                <View>
                    <Image
                        source={{ uri: item.doctorImage }} // Placeholder image
                        className=' w-20 h-20 rounded-full'
                    />
                    <Text style={{ color: themeColors.textColor }} className=' mt-2'>Time</Text>
                    <Text style={{ color: themeColors.mainTextColor }}>{item.Time}</Text>
                </View>
                <View className=' ml-10 mt-2 flex-1'>
                    <Text style={{ color: themeColors.mainTextColor }}>{item.DoctorName}</Text>
                    <Text style={{ color: themeColors.textColor }}>{item.Specialization}</Text>
                    <View className=' flex-row gap-5 py-3'>
                        <View className=' flex-row items-center justify-center'>
                            <View style={{ backgroundColor: themeColors.diffrentColorPerpleBG }} className=' p-1 bg-black rounded-full mr-1'>
                                <Ionicons name={"gift"} size={16} color={themeColors.diffrentColorPerple} />
                            </View>
                            <Text className=' ml-1' style={{ color: themeColors.textColor }}>{item.experience}</Text>
                        </View>
                        <View className=' flex-row items-center justify-center'>
                            <View style={{ backgroundColor: '#FFCBCB' }} className=' p-1 bg-black rounded-full mr-1'>
                                <Ionicons name={"heart"} size={16} color={themeColors.diffrentColorRed} />
                            </View>
                            <Text className=' ml-1' style={{ color: themeColors.textColor }}>{item.results*100}%</Text>
                        </View>
                    </View>

                    {/* Show the doctor's leave or off day message */}
                    {isOnLeave && <Text style={{ color: themeColors.textColor, marginVertical: 5 }}>{leaveMessage}</Text>}
                    {isOffDay && <Text style={{ color: themeColors.textColor, marginVertical: 5 }}>{offDayMessage}</Text>}

                    {/* Only render the "Make an appointment" button if the doctor is available */}
                    {isAvailable && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("DoctorDetails", {
                                selectedDate: selectedDate,
                                doctorName: item?.DoctorName,
                                specialization: item?.Specialization,
                                rating: item?.rating,
                                OffDays: item?.OffDays,
                                Time: item?.Time,
                                Category: item?.Category,
                                OffDates: item?.OffDates,
                                doctorImage: item?.doctorImage,
                            })}
                            style={{ backgroundColor: themeColors.diffrentColorPerple }} className=' bg-gray-800 py-3 rounded-full items-center justify-center'>
                            <Text style={{ color: themeColors.mainTextColor }}>Make an appointment</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: themeColors.secComponentColor }}>
            <View style={{ backgroundColor: themeColors.diffrentColorPerple }} className=' px-3 '>
                <View className=' p-5'>
                    <TouchableOpacity onPress={() => navigation.goBack()} className=' py-4 absolute'>
                        <Ionicons name="chevron-back-outline" size={24} color={themeColors.mainTextColor} />
                    </TouchableOpacity>
                    <Text style={{ color: themeColors.mainTextColor }} className=' text-center'>Doctors</Text>
                </View>

                {/* Search */}
                <View style={{ backgroundColor: themeColors.secComponentColor }}
                    className='px-2 py-1 flex-row rounded-full items-center justify-center'>
                    <Ionicons name={"search"} size={28} color={themeColors.textColor} />
                    <TextInput
                        className=' flex-1 ml-1'
                        placeholder="Search a Doctor or Speciality"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Date Selector */}
                <View className=' py-4'>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={dates}
                        keyExtractor={(item) => item.date}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => setSelectedDate(item)}
                                style={{ alignItems: "center", marginRight: 15 }}
                            >
                                <Text style={{ color: "white", opacity: selectedDate.date === item.date ? 1 : 0.6 }}>{item.day}</Text>
                                <View
                                    style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: selectedDate.date === item.date ? "white" : "rgba(255, 255, 255, 0.3)",
                                    }}
                                >
                                    <Text style={{ color: selectedDate.date === item.date ? "#3BA8C6" : "white", fontWeight: "bold" }}>{item.date}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>

            {/* Sections */}
            {/* <ScrollView>
                <Text style={{ color: themeColors.mainTextColor, padding: 10 }}>Available</Text>
                <FlatList
                    data={availableDoctors}
                    renderItem={renderDoctor}
                    keyExtractor={item => item.DoctorName}
                />
                
                <Text style={{ color: themeColors.mainTextColor, padding: 10 }}>Offday</Text>
                <FlatList
                    data={offdayDoctors}
                    renderItem={renderDoctor}
                    keyExtractor={item => item.DoctorName}
                />
                
                <Text style={{ color: themeColors.mainTextColor, padding: 10 }}>On Leave</Text>
                <FlatList
                    data={onLeaveDoctors}
                    renderItem={renderDoctor}
                    keyExtractor={item => item.DoctorName}
                />
            </ScrollView> */}

            <SectionList
                sections={[
                    {
                        title: 'Available',
                        data: availableDoctors,
                    },
                    {
                        title: 'Offday',
                        data: offdayDoctors,
                    },
                    {
                        title: 'On Leave',
                        data: onLeaveDoctors,
                    }
                ]}
                keyExtractor={(item, index) => item.DoctorName + index}
                renderItem={renderDoctor}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={{ backgroundColor: themeColors.secComponentColor }}>
                        <Text className=' uppercase' style={{ color: themeColors.mainTextColor, padding: 10, fontWeight: 'bold' }}>
                            {title}
                        </Text>
                    </View>
                )}
                stickySectionHeadersEnabled
            />
        </View>
    );
};

export default DoctorsScreen;