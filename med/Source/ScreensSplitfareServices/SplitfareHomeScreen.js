import { View, Text, TextInput, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useContext } from 'react';
import { StatusBar } from 'react-native';
import { ThemeContext } from '../Context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import DateTimePickerModal
import TextStyles from '../Style/TextStyles';

export default function SplitfareHomeScreen() {
    const { themeColors } = useContext(ThemeContext);
    const navigation = useNavigation();
    const fontstyles = TextStyles();

    // State for user input
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [goingDate, setGoingDate] = useState(null);
    const [peopleCount, setPeopleCount] = useState(1); // Default value for number of people

    // State for showing/hiding the date picker modal
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    // State for validation errors
    const [errors, setErrors] = useState({});

    // Function for incrementing people count
    const handleIncrement = () => {
        setPeopleCount(prevCount => prevCount + 1);
    };

    // Function for decrementing people count
    const handleDecrement = () => {
        if (peopleCount > 1) {
            setPeopleCount(prevCount => prevCount - 1);
        } else {
            Alert.alert('Minimum people count is 1');
        }
    };

    // Function to handle date selection from the DateTimePickerModal
    const handleDateConfirm = (date) => {
        setGoingDate(date.toLocaleDateString()); // Format the date as needed
        setDatePickerVisible(false); // Close the date picker after selecting
    };

    // Function to hide the date picker
    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    // Function to validate input fields
    const validateInputs = () => {
        let validationErrors = {};
        // if (fromLocation.length < 4) {
        //     validationErrors.fromLocation = 'Starting Point must be at least 4 characters';
        // }
        // if (toLocation.length < 4) {
        //     validationErrors.toLocation = 'Destination must be at least 4 characters';
        // }
        if (!goingDate) {
            validationErrors.goingDate = 'Please pick a date';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Function to handle Search button click
    const handleSearch = () => {
        if (validateInputs()) {
            navigation.navigate('SplitfareRides', {
                fromLocation,
                toLocation,
                goingDate,
                peopleCount,
            });
        } else {
            Alert.alert('Please fix the errors');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, backgroundColor: themeColors.backGroundColor }}>
                    <StatusBar
                        barStyle={themeColors.backGroundColor === '#1C1C1E' ? 'light-content' : 'dark-content'}
                        backgroundColor={themeColors.bottomNav}
                    />

                    <View className='w-full h-full px-8 py-16 flex items-center justify-center'>
                        <View style={{ backgroundColor: themeColors.componentColor, elevation: 3 }} className='rounded-2xl w-full overflow-hidden'>
                            <View
                                className='pt-4 px-6 space-y-6'
                            >
                                <View className='space-y-4'>
                                    {/* Leaving from Location Input */}
                                    <View>
                                        <View className='flex-row items-center border-b-2 h-11' style={{ borderBlockColor: themeColors.secComponentColor }}>
                                            <Ionicons name="locate" size={24} color={fromLocation ? themeColors.diffrentColorPerple : themeColors.textColor} />
                                            <View className=' flex-1 justify-center'>
                                                <TextInput
                                                    value={fromLocation}
                                                    onChangeText={setFromLocation}
                                                    placeholderTextColor={themeColors.placeholderTextColor}
                                                    style={[fontstyles.h5, {
                                                        flex: 1,
                                                        paddingHorizontal: 10,
                                                        color: themeColors.mainTextColor,
                                                    }]}
                                                />
                                                {fromLocation ? fromLocation :
                                                    <Text className=' absolute left-0 -z-30 pt-1' style={[fontstyles.h5, {
                                                        color: themeColors.textColor,
                                                        paddingHorizontal: 10,
                                                    }]}>
                                                        Leaving from
                                                        <Text style={[fontstyles.h6,]}>
                                                            (optional)
                                                        </Text>
                                                    </Text>
                                                }
                                            </View>
                                        </View>
                                        {errors.fromLocation && <Text style={[fontstyles.h6, { color: themeColors.diffrentColorRed }]}>{errors.fromLocation}</Text>}
                                    </View>

                                    {/* Going to Location Input */}
                                    <View>
                                        <View className='flex-row items-center border-b-2 h-11' style={{ borderBlockColor: themeColors.secComponentColor }}>
                                            <Ionicons name="locate" size={24} color={toLocation ? themeColors.diffrentColorPerple : themeColors.textColor} />
                                            <View className=' flex-1 justify-center'>
                                                <TextInput
                                                    value={toLocation}
                                                    onChangeText={setToLocation}
                                                    placeholderTextColor={themeColors.placeholderTextColor}
                                                    style={[fontstyles.h5, {
                                                        flex: 1,
                                                        paddingHorizontal: 10,
                                                        color: themeColors.mainTextColor,
                                                    }]}
                                                />
                                                {toLocation ? toLocation :
                                                    <Text className=' absolute left-0 -z-30 pt-1' style={[fontstyles.h5, {
                                                        color: themeColors.textColor,
                                                        paddingHorizontal: 10,
                                                    }]}>
                                                        Going to
                                                        <Text style={[fontstyles.h6,]}>
                                                            (optional)
                                                        </Text>
                                                    </Text>
                                                }
                                            </View>
                                        </View>
                                        {/* Error Message for To Location */}
                                        {errors.toLocation && <Text style={[fontstyles.h6, { color: themeColors.diffrentColorRed }]}>{errors.toLocation}</Text>}
                                    </View>

                                    {/* Date Picker Input */}
                                    <View>
                                        <TouchableOpacity
                                            className='flex-row items-center border-b-2 h-11 pb-1' style={{ borderBlockColor: themeColors.secComponentColor }}
                                            onPress={() => setDatePickerVisible(true)}
                                        >
                                            <Ionicons name="calendar" size={24} color={goingDate ? themeColors.diffrentColorPerple : themeColors.textColor} />
                                            <Text style={[fontstyles.h5, {
                                                // color: themeColors.textColor,
                                                color: goingDate ? themeColors.mainTextColor : themeColors.textColor,
                                                paddingHorizontal: 10,
                                            }]}>
                                                {goingDate ? goingDate : 'Pick a Date*'}
                                            </Text>
                                        </TouchableOpacity>
                                        {/* Error Message for Date Picker */}
                                        {errors.goingDate && <Text style={[fontstyles.h6, { color: themeColors.diffrentColorRed }]}>{errors.goingDate}</Text>}
                                    </View>

                                    <View
                                        className='flex-row items-center justify-center h-11 pb-1' style={{ borderBlockColor: themeColors.secComponentColor }}
                                    >
                                        <TouchableOpacity className=' absolute left-0  h-[120%] justify-center w-[45%]' onPress={handleDecrement}>
                                            <Ionicons name="remove-circle" size={24} color={themeColors.textColor} />
                                        </TouchableOpacity>
                                        <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.mainTextColor }]}>
                                            {peopleCount}
                                        </Text>
                                        <TouchableOpacity className=' absolute right-0 h-[120%] justify-center w-[45%] items-end' onPress={handleIncrement}>
                                            <Ionicons name="add-circle" size={24} color={themeColors.textColor} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            {/* Search Button */}
                            <TouchableOpacity
                                onPress={handleSearch}
                                className=' p-4 '
                                style={{ backgroundColor: themeColors.diffrentColorPerple }}
                            >
                                <Text style={[fontstyles.h4, { color: themeColors.backGroundColor, textAlign: 'center' }]}>
                                    Search
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Date Picker Modal */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleDateConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
