import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { View, Text, StyleSheet, TextInput, Button, Modal, TouchableOpacity, FlatList, Alert } from 'react-native';
import { ThemeContext } from '../Context/ThemeContext';
import TextStyles from '../Style/TextStyles';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Data for laundry facilities
const laundryData = [
    { hostel: 'Aibaan', timings: 'Wednesday, Saturday' },
    { hostel: 'Beauki', timings: 'Monday, Thursday' },
    { hostel: 'Duven', timings: 'Monday, Thursday' },
    { hostel: 'Emiet', timings: 'Tuesday, Friday' },
    { hostel: 'Firpeal', timings: 'Monday, Thursday' },
    { hostel: 'Griwiksh', timings: 'Monday, Thursday' },
    { hostel: 'Hiqom', timings: 'Tuesday, Friday' },
    { hostel: 'Ijokha', timings: 'Wednesday, Saturday' },
    { hostel: 'Jurqia', timings: 'Wednesday, Saturday' },
];

const daysForDelivery = 2;

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function LaundryHomeScreen() {
    const navigation = useNavigation();
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const fontstyles = TextStyles();

    const [selectedHostel, setSelectedHostel] = useState('');
    const [description, setDescription] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [laundryItems, setLaundryItems] = useState([]);
    const [showHostelModal, setShowHostelModal] = useState(false);

    // Function to store laundry items in AsyncStorage
    const storeLaundryItems = async (items) => {
        try {
            const jsonValue = JSON.stringify(items);
            await AsyncStorage.setItem('@laundryItems', jsonValue);
        } catch (e) {
            console.error("Error storing laundry items", e);
        }
    };

    // Function to load laundry items from AsyncStorage
    const loadLaundryItems = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@laundryItems');
            if (jsonValue != null) {
                setLaundryItems(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error("Error loading laundry items", e);
        }
    };

    useEffect(() => {
        loadLaundryItems();
    }, []);

    useEffect(() => {
        storeLaundryItems(laundryItems);
    }, [laundryItems])


    // Load selected hostel from AsyncStorage
    useEffect(() => {
        const loadHostelFromStorage = async () => {
            try {
                const storedHostel = await AsyncStorage.getItem('@selectedHostel');
                if (storedHostel) {
                    setSelectedHostel(storedHostel);
                    handleHostelSelection(storedHostel);
                }
            } catch (e) {
                console.error("Error loading hostel from AsyncStorage", e);
            }
        };

        loadHostelFromStorage();
    }, []);

    const handleHostelSelection = async (hostel) => {
        setSelectedHostel(hostel);

        // Save selected hostel in AsyncStorage
        try {
            await AsyncStorage.setItem('@selectedHostel', hostel);
        } catch (e) {
            console.error("Error storing hostel", e);
        }

        const addDaysForDelivery = (Day) => {
            const dayIndex = dayNames.indexOf(Day);
            return dayNames[(dayIndex + daysForDelivery) % 7];
        };

        const hostelData = laundryData.find(item => item.hostel === hostel);
        if (hostelData) {
            setPickupDate(hostelData.timings);
            setDeliveryDate(
                [
                    addDaysForDelivery(hostelData.timings.split(',')[0].trim()),
                    addDaysForDelivery(hostelData.timings.split(',')[1].trim())
                ].join(', ')
            );
        }
        setShowHostelModal(false);
    };

    const handleSubmitLaundry = () => {
        if (description.trim() === '') {
            Alert.alert('Error', 'Please provide a description of the laundry items.');
            return;
        }

        if (selectedHostel.trim() === '') {
            Alert.alert('Error', 'Please select Hostel.');
            return;
        }

        const today = new Date().getDay();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const pickupNumbers = pickupDate.split(', ').map(day => dayNames.indexOf(day.trim()));

        const calculateGap = (targetDay) => targetDay >= today ? targetDay - today : 7 - (today - targetDay);
        const smallestGapIndex = Math.min(...pickupNumbers.map(calculateGap));

        const getDayWithSuffix = (day) => {
            if (day > 3 && day < 21) return `${day}th`;
            switch (day % 10) {
                case 1: return `${day}st`;
                case 2: return `${day}nd`;
                case 3: return `${day}rd`;
                default: return `${day}th`;
            }
        };

        const formatDate = (date) => {
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const weekday = date.toLocaleString('default', { weekday: 'short' });
            return `${weekday}, ${getDayWithSuffix(day)} ${month} ${year}`;
        };


        const currentDatePickup = new Date();
        currentDatePickup.setDate(currentDatePickup.getDate() + smallestGapIndex);

        const currentDateDelivery = new Date();
        currentDateDelivery.setDate(currentDateDelivery.getDate() + smallestGapIndex + 2);

        const formattedDatePickup = formatDate(currentDatePickup);
        const formattedDelivery = formatDate(currentDateDelivery);

        // console.log(formattedDatePickup, formattedDelivery);

        const newLaundryItem = {
            id: Date.now(),
            hostel: selectedHostel,
            description,
            pickupDate: formattedDatePickup,
            deliveryDate: formattedDelivery,
        };

        setLaundryItems([newLaundryItem, ...laundryItems]);
        setDescription('');
        Alert.alert('Success', 'Laundry details submitted successfully!');
    };

    // Render Hostel Modal with list of options
    const renderHostelModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showHostelModal}
        onRequestClose={() => setShowHostelModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View className=' w-[90%] p-4 rounded-xl' style={{ backgroundColor: themeColors.backGroundColor }}>
                    <Text className=' text-center pb-2' style={[fontstyles.h3, { color: themeColors.mainTextColor }]}>Select Hostel</Text>
                    <FlatList
                        data={laundryData}
                        keyExtractor={(item) => item.hostel}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className=' p-2 mb-[6px] rounded-lg'
                                style={{ backgroundColor: themeColors.secComponentColor }}
                                onPress={() => handleHostelSelection(item.hostel)}
                            >
                                <Text className=' text-center' style={[fontstyles.h5, { color: themeColors.textColor }]}>{item.hostel}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity className=' mt-2 p-1 rounded-xl' style={[{ backgroundColor: themeColors.diffrentColorPerple }]}
                        onPress={() => setShowHostelModal(false)}
                    >
                        <Text className=' text-center ' style={[fontstyles.h4, { color: themeColors.backGroundColor }]}>
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={{ flex: 1, backgroundColor: themeColors.backGroundColor }}>
            <StatusBar
                barStyle={themeColors.backGroundColor === '#1C1C1E' ? 'light-content' : 'dark-content'}
                backgroundColor={themeColors.bottomNav}
            />
            {/* Title */}
            {/* <Text style={styles.title}>Laundry Facility</Text> */}

            ;
            {/* styles.grayscale */}
            <FlatList
                data={laundryItems}
                ListHeaderComponent={
                    <View className=' p-2'>
                        <TouchableOpacity className=' my-3 p-3 rounded-xl' style={[{ backgroundColor: themeColors.diffrentColorPerple }]} onPress={() => setShowHostelModal(true)}>
                            <Text className=' text-center ' style={[fontstyles.h4, { color: themeColors.backGroundColor }]}>
                                {selectedHostel ? selectedHostel : 'Select Hostel'}
                            </Text>
                        </TouchableOpacity>
                        {selectedHostel ? (
                            <View className=' items-center justify-center'>
                                <View className='flex-row mb-1 gap-1'>
                                    <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                        Pickup Day are:
                                    </Text>
                                    <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>
                                        {pickupDate}
                                    </Text>
                                </View>
                                <View className='flex-row mb-1 gap-1'>
                                    <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                        Delivery Day are:
                                    </Text>
                                    <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>
                                        {deliveryDate}
                                    </Text>
                                </View>
                            </View>
                        )
                            :
                            <Text className=' py-2 text-center' style={[fontstyles.h6, { lineHeight: 14, color: themeColors.diffrentColorRed }]}>
                                Note: This is not an exact representation of your laundry items. This tool is designed to help you record and track your laundry details as per the guidelines provided and data entered by you.
                                {/* Please refer to the official laundry schedule and guidelines for accurate information. */}
                            </Text>
                        }
                    </View>

                }
                renderItem={({ item }) => (
                    <View className=' p-3 mx-2 rounded-xl mb-2' style={[{ elevation: 3, backgroundColor: themeColors.componentColor }]}>
                        {/* (new Date() > new Date(item.deliveryDate) && styles.grayscale), */}
                        <Text style={[fontstyles.h5_bold, { color: themeColors.diffrentColorPerple }]}>{item.hostel}</Text>
                        <View className='flex-row mb-1 gap-1'>
                            <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>Pickup:</Text>
                            <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]}>{item.pickupDate}</Text>
                        </View>
                        <View className='flex-row mb-1 gap-1'>
                            <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>Delivery:</Text>
                            <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]}>{item.deliveryDate}</Text>
                        </View>
                        <View className='flex-row mb-1 gap-1'>
                            <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>Items:</Text>
                            <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]}>{item.description}</Text>
                        </View>
                    </View>
                )}
                ListFooterComponent={<View className=' pb-40' />}
                keyExtractor={(item, index) => index.toString()}
            />
            {/* <ScrollView
                contentContainerStyle={{ paddingBottom: 150 }}  // Adjust the padding for the bottom of the content
            >
                <View className=' p-2'>
                    <TouchableOpacity
                        className=' my-3 p-3 rounded-xl'
                        style={[{ backgroundColor: themeColors.diffrentColorPerple }]}
                        onPress={() => setShowHostelModal(true)}
                    >
                        <Text
                            className=' text-center '
                            style={[fontstyles.h4, { color: themeColors.backGroundColor }]}
                        >
                            {selectedHostel ? selectedHostel : 'Select Hostel'}
                        </Text>
                    </TouchableOpacity>
                    {selectedHostel ? (
                        <View className=' items-center justify-center'>
                            <View className='flex-row mb-1 gap-1'>
                                <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                    Pickup Day are:
                                </Text>
                                <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>
                                    {pickupDate}
                                </Text>
                            </View>
                            <View className='flex-row mb-1 gap-1'>
                                <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.textColor }]}>
                                    Delivery Day are:
                                </Text>
                                <Text style={[fontstyles.h5_bold, { fontSize: 18, color: themeColors.mainTextColor }]}>
                                    {deliveryDate}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <Text
                            className=' py-2 text-center'
                            style={[fontstyles.h6, { lineHeight: 14, color: themeColors.diffrentColorRed }]}
                        >
                            Note: This is not an exact representation of your laundry items. This tool is designed to help you record and track your laundry details as per the guidelines provided and data entered by you.
                        </Text>
                    )}
                </View>

                {laundryItems.map((item, index) => (
                    <View
                        key={index}
                        className=' p-3 mx-2 rounded-xl mb-2'
                        style={{ elevation: 3, backgroundColor: themeColors.componentColor }}
                    >
                        <Text style={[fontstyles.h5_bold, { color: themeColors.diffrentColorPerple }]}>
                            {item.hostel}
                        </Text>
                        <View className='flex-row mb-1 gap-1'>
                            <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>Pickup:</Text>
                            <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]}>
                                {item.pickupDate}
                            </Text>
                        </View>
                        <View className='flex-row mb-1 gap-1'>
                            <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>Delivery:</Text>
                            <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]}>
                                {item.deliveryDate}
                            </Text>
                        </View>
                        <View className='flex-row mb-1 gap-1'>
                            <Text style={[fontstyles.h5_5, { color: themeColors.textColor }]}>Items:</Text>
                            <Text style={[fontstyles.h5_5, { color: themeColors.mainTextColor }]}>
                                {item.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView> */}

            <View style={{ backgroundColor: themeColors.secComponentColor, elevation: 10 }} className=' px-2 pt-4 absolute bottom-0 w-full self-center'>
                {/* Custom Hostel Dropdown */}
                {/* Display Selected Hostel Pickup & Delivery Dates */}


                <View className='flex-row items-center h-11 rounded-xl' style={{ borderWidth: 1, borderBlockColor: themeColors.textColor }}>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        // placeholderTextColor={themeColors.placeholderTextColor}
                        style={[fontstyles.h5, {
                            flex: 1,
                            paddingHorizontal: 10,
                            color: themeColors.mainTextColor,
                        }]}
                    />
                    {description ? description :
                        <Text className=' absolute left-0 -z-30 pt-1' style={[fontstyles.h5, {
                            color: themeColors.textColor,
                            paddingHorizontal: 10,
                        }]}>
                            Enter description
                            <Text style={[fontstyles.h6,]}>
                                (e.g., 3 shirts, 2 pants)
                            </Text>
                        </Text>
                    }
                </View>

                {/* Submit Button */}
                <TouchableOpacity className=' my-3 p-3 rounded-xl' style={[{ backgroundColor: themeColors.diffrentColorPerple }]} onPress={handleSubmitLaundry}>
                    <Text className=' text-center ' style={[fontstyles.h4, { color: themeColors.backGroundColor }]}>
                        Submit Details
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Hostel Selection Modal */}
            {renderHostelModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    grayscale: {
        filter: 'grayscale(100%)',  // For web CSS approach
        // On React Native, you might need an image filter library or use a more creative workaround.
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginVertical: 5,
        borderRadius: 5,
    },
    modalItemText: {
        fontSize: 16,
    },
    closeModalButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        marginTop: 20,
        borderRadius: 5,
    },
    closeModalButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});