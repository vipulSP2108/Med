import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { API_BASE_URL, ORDERHISTORYDATA_ENDPOINT } from '../Constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextStyles from '../Style/TextStyles';
import Colors from '../Components/Colors';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../Context/ThemeContext';

const HistorySeller = () => {
    const { userData, outletsNEW } = useContext(GlobalStateContext);
    const [historyOutlet, setHistoryOutlet] = useState([]);
    const fontstyles = TextStyles();
    const { themeColors, toggleTheme } = useContext(ThemeContext);

    const getData = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            console.log(token);
            const response = await fetch(`${API_BASE_URL}:${ORDERHISTORYDATA_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();

            // Update state with the correct array
            setHistoryOutlet(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <View className='h-full w-full mb-6 px-4' style={{ backgroundColor: themeColors.subbackGroundColor }}>
            <StatusBar 
            backgroundColor={themeColors.statusBarColor}
            // backgroundColor={themeColors.backGroundColor} 
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                {historyOutlet.length === 0 ? (
                    <View className="flex-1 justify-center items-center p-2" style={{ height: Dimensions.get('window').height * 1 }}>
                        <Text className="font-black text-xl text-center py-3" style={{ color: themeColors.mainTextColor }}>No order history available</Text>
                    </View>
                ) : (
                    historyOutlet[0].orderDetails.map((orderData, index) => {
                        return (
                            <View key={index}>
                                {index === 0 || orderData.date !== historyOutlet[0].orderDetails[index - 1]?.date ? (
                                    <View className=' mt-4'>
                                        <Text className=' text-center' style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>
                                            Date
                                        </Text>
                                        <Text className=' text-center' style={[fontstyles.h4, { color: themeColors.textColor }]}>
                                            {orderData.date}
                                        </Text>
                                    </View>
                                ) : null}

                                <ListCard_Self4 orderData={orderData} fontstyles={fontstyles} index={index} />
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
};


const ListCard_Self4 = ({ orderData, fontstyles, index }) => {
    const [showDetails, setShowDetails] = useState(null);
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    
    useFocusEffect(
        useCallback(() => {
            setShowDetails(null);
        }, [])
    );

    const [infoUserIDState, setInfoUserIDState] = useState(true);

    return (
        <View style={[styles.orderContainer, {backgroundColor: themeColors.shadowcolor,}]}>
            <View className='flex-row justify-between'>
                <View>
                    <Text className=' mr-1' style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>Order Status</Text>
                    <Text style={[fontstyles.h3, { color: (orderData.status == 'Declined' || orderData.status == 'Complaint_Registered') ? themeColors.diffrentColorRed : themeColors.textColor }]}>
                        {orderData.status}
                    </Text>
                    {/* <TouchableOpacity onPress={() => setInfoUserIDState(!infoUserIDState)} className='flex-row items-center'>
                        <Text className=' mr-1' style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>Details</Text>
                        <Ionicons
                            style={{ marginTop: 7 }}
                            color={themeColors.mainTextColor}
                            name={'information-circle'}
                            size={21}
                        />
                    </TouchableOpacity>
                    <Text style={[fontstyles.h4, { color: themeColors.textColor }]}>
                        {infoUserIDState ? orderData.id : orderData.userInfocontactinfo.split('@')[0]}
                    </Text> */}
                </View>
                <View className='items-end'>
                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>Total Amount</Text>
                    <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorOrange }]}>₹{orderData.totalPrice}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => setShowDetails(!showDetails)} className='flex-row justify-end rounded-md items-end' style={{ borderWidth: 0, borderColor: themeColors.diffrentColorOrange }}>
                <Text style={[fontstyles.h4, { fontSize: 20, color: themeColors.textColor }]}>
                    {orderData.orders.length} {orderData.orders.length > 1 ? 'items' : 'item'}
                </Text>
                <View className=' items-end justify-end ml-1 mb-2'>
                    {/* <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.textColor }]} className='underline mr-1'>view full order</Text> */}
                    <Ionicons className=' bottom-0 right-0' name={showDetails ? 'caret-up' : 'caret-down'} size={14} color={themeColors.textColor} />
                </View>
            </TouchableOpacity>

            {showDetails && orderData.orders.map((order, index) => (
                <View key={`${order.id}_${index}`} className='flex-row justify-between'>
                    <Text style={[fontstyles.blackh2, { fontSize: 23, }]} className='text-white'>
                        {order.quantity} x {order.name}
                    </Text>
                    <Text style={[fontstyles.number, { fontSize: 18, }]} className='text-white'>
                        ₹ {order.quantity * order.price}
                    </Text>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    orderContainer: {
        marginBottom: 18,
        padding: 15,
        borderRadius: 8,
    },
    // container: {
    //     flex: 1,
    //     padding: 20,
    //     backgroundColor: '#f5f5f5',
    // },
    // orderCard: {
    //     backgroundColor: '#fff',
    //     padding: 15,
    //     marginBottom: 15,
    //     borderRadius: 8,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 5,
        // elevation: 3,
    // },
    // orderDate: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //     marginBottom: 5,
    // },
    // noDataText: {
    //     fontSize: 16,
    //     textAlign: 'center',
    //     color: '#777',
    //     marginTop: 50,
    // },
});

export default HistorySeller;
