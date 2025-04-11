import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
    FlatList,
    Linking,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { ACCEPTORDER_ENDPOINT, API_BASE_URL, CHANGEORDERSTATUS_ENDPOINT, DECLINEORDER_ENDPOINT, ORDERSSELLER_ENDPOINT } from '../Constants/Constants';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import Colors from '../Components/Colors';
import TextStyles from '../Style/TextStyles';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../Context/ThemeContext';
import { StatusBar } from 'react-native-web';

export default function OrderHistorySeller() {
    const [orders, setOrders] = useState([]);
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const [noOrders, setNoOrders] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [timer, setTimer] = useState(0); // Timer state
    const { userData, orderLength, setOrderLength } = useContext(GlobalStateContext);

    const fontstyles = TextStyles();
    const navigation = useNavigation();

    // Fetch orders for the seller
    const fetchOrders = async () => {
        const contactinfo = { contactinfo: userData.contactinfo };

        try {
            const response = await fetch(`${API_BASE_URL}:${ORDERSSELLER_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactinfo),
            });

            const data = await response.json();
            if (data.status === 'ok') {
                setOrders(data.data);

                if (orders.length < data.data.length) {
                    // console.log('asd new order',orderLength,data.data.length)
                    setOrderLength(data.data.length)
                }
                setNoOrders(data.data.length === 0); // If no orders, set noOrders to true
            } else if (data.status === "alert") {
                setNoOrders(true); // No orders available, set noOrders to true
            } else {
                console.error('Error fetching orders: OrderHistorySeller', data);
                setNoOrders(true); // In case of error, set noOrders to true
            }
        } catch (error) {
            console.error('Error fetching orders: OrderHistorySeller', error);
            setNoOrders(true); // In case of error, set noOrders to true
        }
    };


    useEffect(() => {
        fetchOrders();
        const intervalId = setInterval(() => {
            fetchOrders(); // Refresh orders every 10 seconds
        }, 10000); // Poll every 10 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);


    const interpolateColor = (percentage) => {
        // Adjust colors from green (start) to red (end)
        const r = Math.min(255, Math.max(0, Math.floor((percentage / 100) * 255)));
        const g = Math.min(255, Math.max(0, Math.floor((1 - percentage / 100) * 255)));
        const b = 0;

        return `rgb(${r},${g},${b})`;
    };

    const getRemainingTime = (startTime, timer) => {
        const targetTime = new Date(startTime).getTime() + timer * 60000; // startTime + timer in milliseconds
        const currentTime = new Date().getTime();
        const remainingTime = targetTime - currentTime;

        if (remainingTime <= 0) {
            return { minutes: 0, seconds: 0 };
        }

        const remainingMinutes = Math.floor(remainingTime / 60000);
        const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);

        const remainingTime_inPersent = ((remainingMinutes * 60) / (timer * 60)) * 100

        return { minutes: remainingMinutes, seconds: remainingSeconds, persent: remainingTime_inPersent };
    };


    // Accept an order and set timer (merged backend call)
    const acceptOrder = async (orderId, timer) => {
        try {
            const response = await fetch(`${API_BASE_URL}:${ACCEPTORDER_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, timer }), // Pass both orderId and timer
            });

            const data = await response.json();
            if (data.status === 'ok') {
                fetchOrders(); // Refresh the orders after accepting
                setModalVisible(false); // Close the modal
            } else {
                console.error('Error accepting order:', data);
            }
        } catch (error) {
            console.error('Error accepting order:', error);
        }
    };

    // Chnage an order Status (Call backend /declineOrder)

    const changeOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}:${CHANGEORDERSTATUS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, newStatus }),
            });

            const data = await response.json();
            if (data.status === 'ok') {
                fetchOrders(); // Refresh the orders after declining
                setModalVisible(false); // Close the modal
            } else {
                console.error('Error declining order:', data);
            }
        } catch (error) {
            console.error('Error declining order:', error);
        }
    };

    // Decline an order (Call backend /declineOrder)
    const declineOrder = async (orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}:${DECLINEORDER_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();
            if (data.status === 'ok') {
                fetchOrders(); // Refresh the orders after declining
                setModalVisible(false); // Close the modal
            } else {
                console.error('Error declining order:', data);
            }
        } catch (error) {
            console.error('Error declining order:', error);
        }
    };

    const renderOrderItem = ({ item, index }) => {
        const { minutes, seconds, persent } = getRemainingTime(item.startTime, item.timer); // Calculate the remaining time
        const persentBackgroundColor = persent;

        const infoUserID = infoUserIDState[index] ?? true;

        return (
            <View style={[styles.orderContainer, { backgroundColor: themeColors.backGroundColor == "#1C1C1E" ? 'rgba(180, 180, 180, 0.15)' : themeColors.componentColor }]}> {/* themeColors.backGroundColor == "#1C1C1E" ? 'rgba(180, 180, 180, 0.15)' :  */}
                <View className='flex-row justify-between'>
                    <View>
                        <View className='flex-row items-center'>
                            <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>Details</Text>
                            <TouchableOpacity onPressIn={() => toggleInfoUserID(index, false)} onPressOut={() => toggleInfoUserID(index, true)}>
                                <Ionicons style={{ paddingTop: 7, paddingLeft: 4 }} color={themeColors.mainTextColor} name={'information-circle'} size={21} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[fontstyles.h4, { color: themeColors.textColor }]}>{infoUserID ? item.id : item.name.contactinfo.split('@')[0]}</Text>
                    </View>
                    <View className='items-end'>
                        <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>
                            {/* Order Status */}
                            {item.parcel ? 'Parcel' : 'Dine in'}
                        </Text>
                        <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.diffrentColorOrange }]}>{item.status}</Text>
                    </View>
                </View>

                {item?.items?.orders?.map((order, index) => {
                    return (
                        <View key={`${order.id}_${index}`} className='flex-row justify-between'>
                            <View className=' flex-row'>
                                <Text style={[fontstyles.h1, { fontSize: 20, color: themeColors.diffrentColorPerple }]}>
                                    {order.parcel ? 'Parcel:' : 'Dine in:'}
                                </Text>
                                <Text className=' ml-2 ' style={[fontstyles.h4, { color: themeColors.textColor, fontSize: 20, }]} >
                                    {order.quantity} x {order.item}
                                </Text>
                            </View>
                            <Text style={[fontstyles.number, { fontSize: 15, color: themeColors.mainTextColor }]} className='text-white'>
                                ₹ {order.quantity * order.price}
                            </Text>
                        </View>
                    );
                })}

                <View className=' mt-3 flex-row '>
                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor }]}>Total Amount:  </Text>
                    <Text style={[fontstyles.number, { fontSize: 16, color: themeColors.mainTextColor, marginTop: 5 }]}>₹ {item.totalPrice}</Text>
                </View>
                <View className=' mb-3 flex-row flex-wrap'>
                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20 }]}>Massage:  </Text>
                    <Text style={[fontstyles.h6, { paddingTop: 10, fontSize: 20, color: themeColors.mainTextColor, lineHeight: 18 }]}>{item.massage.length == 0 ? 'No massage' : item.massage}</Text>
                    <TouchableOpacity
                        onPress={
                            () => {
                                if (item.name.phone) {
                                    Linking.openURL(`tel:${item.name.phone}`)
                                        .catch((err) => console.error('Error opening phone dialer:', err));
                                } else {
                                    Alert.alert("Contact No not provided")
                                }
                            }
                        }
                        style={{ backgroundColor: themeColors.diffrentColorGreen }} className=' absolute h-10 w-10 bottom-0 right-0 rounded-md items-center justify-center'>
                        <Ionicons size={28} name='call' />
                    </TouchableOpacity>
                </View>

                {
                    item.status !== "Scheduled" ? (
                        item.status == "Prepared" || item.status == "User Not Came" ? (
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.acceptButton, { backgroundColor: themeColors.diffrentColorGreen, }]}
                                    onPress={() => {
                                        const { name, items: { __v, closingTime, details, featured, leaveDay, offDays, openingTime, rating, ratingcount, ...restOfItems }, ...itemWithoutName } = item;
                                        console.log('Histry Updated')
                                        changeOrderStatus(item._id, "User Came");
                                    }}
                                >
                                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 18 }]}>Picked Up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.declineButton, { backgroundColor: themeColors.diffrentColorRed, }]}
                                    onPress={() => {
                                        changeOrderStatus(item._id, "User Not Came");
                                        navigation.navigate('ComplaintScreen', {
                                            userName: item.name.contactinfo,
                                            orderNumber: item.id,
                                            order_Id: item._id,
                                            fetchOrders: fetchOrders, // Should be a function
                                        });
                                    }}
                                >
                                    <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20, marginBottom: -3 }]}>Complaint</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        changeOrderStatus(item._id, "Prepared"); // Mark the order as prepared
                                    }}
                                    style={[
                                        {
                                            paddingVertical: 10,
                                            borderRadius: 5,
                                            backgroundColor: themeColors.diffrentColorPerpleBG,
                                        },
                                    ]}
                                    className="bg-white overflow-hidden flex-row items-center justify-center"
                                >
                                    <Text style={[fontstyles.number]} className="text-black text-center uppercase mr-2">
                                        Ready Order
                                    </Text>
                                    <Text style={[fontstyles.number]} className="text-black text-center">
                                        ({minutes}m {seconds}s)
                                    </Text>
                                    <View
                                        style={{
                                            backgroundColor: themeColors.diffrentColorPerple,
                                            width: `${persentBackgroundColor}%`,
                                        }}
                                        className="-z-10 absolute top-0 left-0 h-20"
                                    />
                                </TouchableOpacity>
                                <Text className='text-center' style={[fontstyles.h7, { color: themeColors.mainTextColor, marginTop: 5 }]}>*Click above to set the order for prepared</Text>
                            </>
                        )
                    ) : (
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.acceptButton, { backgroundColor: themeColors.diffrentColorGreen, }]}
                                onPress={() => openModal(item, "Accept")}
                            >
                                <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20, marginBottom: -3 }]}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.declineButton, { backgroundColor: themeColors.diffrentColorRed, }]}
                                onPress={() => {
                                    declineOrder(item._id); // Decline the order
                                }}
                            >
                                <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20, marginBottom: -3 }]}>Decline</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }

            </View>
        );
    };

    // Open modal to accept/decline and set timer
    const openModal = (order, action) => {
        setSelectedOrder(order);
        setTimer(0); // Reset timer to 0
        setModalVisible(true);
    };

    const [infoUserIDState, setInfoUserIDState] = useState({});

    const toggleInfoUserID = (index, val) => {
        setInfoUserIDState((prevState) => ({
            ...prevState,
            [index]: val,
        }));
    };

    const [selectedStatus, setSelectedStatus] = useState('All'); // Default to 'Scheduled'

    return (
        <View style={[styles.container, { backgroundColor: themeColors.backGroundColor }]}>


            <StatusBar
                barStyle={themeColors.backGroundColor == "#1C1C1E" ? 'light-content' : 'dark-content'}
                backgroundColor={themeColors.statusBarColor}
            />
            {noOrders ? (
                <Text style={[styles.noOrdersText, { color: themeColors.mainTextColor, }]}>No orders yet</Text>
            ) : (
                <FlatList
                    // data={orders}
                    data={selectedStatus == "All" ?
                        orders
                        :
                        orders.filter((order) =>
                            order.status === selectedStatus ||
                            (selectedStatus === "Prepared" && order.status === "User Not Came")
                        )}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item?.id?.toString()}
                />
            )}

            {!noOrders &&
                <View style={{ backgroundColor: themeColors.mainTextColor }} className=' rounded-full mb-2'>
                    <View className=' flex-row'>
                        <TouchableOpacity onPress={() => setSelectedStatus('All')} className=' w-1/4 items-center justify-center py-2'>
                            <Text style={[fontstyles.numberbigger, { fontSize: 16, color: selectedStatus == 'All' ? themeColors.diffrentColorOrange : themeColors.backGroundColor }]}>ALL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedStatus('Scheduled')} className=' w-1/4 items-center justify-center py-2'>
                            <Text style={[fontstyles.numberbigger, { fontSize: 16, color: selectedStatus == 'Scheduled' ? themeColors.diffrentColorOrange : themeColors.backGroundColor }]}>New</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedStatus('Accepted')} className=' w-1/4 items-center justify-center py-2'>
                            <Text style={[fontstyles.numberbigger, { fontSize: 16, color: selectedStatus == 'Accepted' ? themeColors.diffrentColorOrange : themeColors.backGroundColor }]}>Ongoing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedStatus('Prepared')} className=' w-1/4 items-center justify-center py-3'>
                            <Text style={[fontstyles.numberbigger, { fontSize: 16, color: selectedStatus == 'Prepared' ? themeColors.diffrentColorOrange : themeColors.backGroundColor }]}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: themeColors.componentColor, }]}>
                        <Text style={[fontstyles.blackh2, { fontSize: 27, color: themeColors.mainTextColor }]}>
                            {selectedOrder ? `Order #${selectedOrder.id}` : 'Order'}
                        </Text>
                        <Text style={[fontstyles.h4, { color: themeColors.textColor }]}>Set Timer (0-60 minutes)</Text>
                        {/*  */}
                        <View className='my-7' style={{ width: 200 }}>
                            <Text className=' text-center mb-2' style={[styles.timerText, { color: themeColors.mainTextColor }]}>{timer} minutes</Text>
                            <Slider
                                minimumTrackTintColor={themeColors.diffrentColorPerpleBG}
                                thumbTintColor={themeColors.diffrentColorPerple}
                                // value={timer}
                                onValueChange={(someValue) => setTimer(someValue)}
                                minimumValue={0}
                                maximumValue={60}
                                step={1}
                            />
                        </View>
                        <View className=' w-full' style={[styles.buttonsContainer]}>
                            <TouchableOpacity
                                style={[styles.button, styles.declineButton, { backgroundColor: themeColors.diffrentColorRed, }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20, marginBottom: -3 }]}>Dismiss</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.acceptButton, { backgroundColor: themeColors.diffrentColorGreen, }]}
                                onPress={() => {
                                    if (selectedOrder) {
                                        acceptOrder(selectedOrder._id, timer); // Accept the order and set the timer
                                    }
                                }}
                            >
                                <Text style={[fontstyles.blackh2, { color: themeColors.mainTextColor, fontSize: 20, marginBottom: -3 }]}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    // foodItemCollectionContainer: {
    //     marginTop: Dimensions.get('window').height * 0.02,
    //     gap: Dimensions.get('window').width * 0.04,
    //     // borderRadius: 2,
    // },
    // shadowProp: {
    //     backgroundColor: 'rgba(180, 180, 180, 0.1)',
    //     elevation: 30,
    // },


    orderItem: {
        padding: 10,
        margin: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    // orderName: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    // },
    orderDetail: {
        padding: 5,
        marginVertical: 5,
        backgroundColor: '#eaeaea',
        borderRadius: 3,
    },
    totalPrice: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    noOrdersText: {
        fontSize: 18,

        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    orderContainer: {
        marginVertical: 7,
        padding: 15,

        borderRadius: 8,
        // borderWidth: 1,
    },
    orderDetails: {
        marginBottom: 10,
    },
    // orderText: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     color: themeColors.mainTextColor,
    // },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    // buttonText: {
    //     color: '#fff',
    //     fontWeight: 'bold',
    //     fontSize: 16,
    // },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    // modalTitle: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     marginBottom: 10,
    // },
    // modalSubtitle: {
    //     fontSize: 16,
    //     marginBottom: 15,
    // },
    slider: {
        width: '100%',
        height: 40,
    },
    timerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    // modalButtons: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     width: '100%',
    // },
    // setTimerButton: {
    //     backgroundColor: themeColors.diffrentColorGreen,
    //     paddingVertical: 10,
    //     paddingHorizontal: 20,
    //     borderRadius: 5,
    //     marginVertical: 5,
    //     flex: 1,
    //     marginRight: 10,
    // },
    // cancelButton: {
    //     marginTop: 15,
    //     paddingVertical: 10,
    //     paddingHorizontal: 20,
    //     backgroundColor: themeColors.diffrentColorGreen,
    //     borderRadius: 5,
    // },
});