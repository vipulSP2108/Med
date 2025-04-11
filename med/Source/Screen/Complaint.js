import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Switch,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../Components/Colors";
import { Ionicons } from "@expo/vector-icons";
import TextStyles from "../Style/TextStyles";
import { GlobalStateContext } from "../Context/GlobalStateContext";
import { SafeAreaView } from "react-native";
import { API_BASE_URL, CHANGEORDERSTATUS_ENDPOINT, COMPLAINTS_ENDPOINT } from "../Constants/Constants";
import useCustomAlert from "../Components/Alerthook";
import { ThemeContext } from "../Context/ThemeContext";

const Complaint = () => {
    const route = useRoute();
    const orderNumber = route.params?.orderNumber || '';
    const order_Id = route.params?.order_Id || '';
    const userName = route.params?.userName || '';
    const fetchOrders = route.params?.fetchOrders;
const { themeColors, toggleTheme } = useContext(ThemeContext);

    const {fontFamilies, userData } = useContext(GlobalStateContext);
    const navigation = useNavigation();
    const [createrName, setCreaterName] = useState(userData?.contactinfo || 0);

    const { showAlert, AlertWrapper } = useCustomAlert();

    const [issue, setIssue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);  // Track whether user is blocked
    const [complaintCount, setComplaintCount] = useState(0);  // Store complaint count

    const isFormValid = issue.length > 5;

    // Function to fetch complaints count
    const handleFetchComplaints = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}:${COMPLAINTS_ENDPOINT}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ createrName: createrName }),  // Fetch complaints based on the selected user
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Error response:', text);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.status === 'ok') {
                // Filter complaints where againstName matches userName
                const filteredComplaints = data.data.filter(complaint => complaint.againstName === userName);
                setComplaintCount(filteredComplaints.length);  // Set the count of filtered complaints
            } else {
                console.error('Error fetching complaints:', data);
            }
        } catch (error) {
            showAlert({
                title: 'Error',
                message: 'Failed to load complaints. Please try again later.',
                codeMassage: { code: '500', text: error.message },
            });
            console.error(error);
        }
    };


    useEffect(() => {
        handleFetchComplaints();
    }, [userName, createrName]);

    const changeOrderStatus = async (orderId, newStatus, issue) => {
        if (!isFormValid) {
            showAlert({
                title: "Missing Information",
                message: "Looks like some fields are empty. Please fill them in to continue.",
                codeMassage: { code: '400', text: '⚠️ Don’t leave anything blank! Fill it up!' },
            });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}:${CHANGEORDERSTATUS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, newStatus, issue, isBlocked }),  // Pass isBlocked status
            });

            const data = await response.json();
            if (data.status === 'ok') {
                Alert.alert("📨 Complaint Submitted", `Your complaint against user has been successfully submitted. We will get back to you within a few days.`)
                navigation.goBack();
                fetchOrders();
            } else {
                console.error('Error declining order:', data);
            }
        } catch (error) {
            console.error('Error declining order:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.backGroundColor }}>
            <StatusBar hidden={false} backgroundColor={themeColors.backGroundColor} />

            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color={themeColors.mainTextColor} />
                </TouchableOpacity>
                <Text style={[TextStyles.h2, { marginLeft: 16, color: themeColors.mainTextColor }]}>
                    File a Complaint
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={[TextStyles.h4, { color: themeColors.textColor, marginBottom: 8 }]}>
                    We are sorry for the inconvenience caused. Please provide the details below to help us resolve your issue.
                </Text>

                {/* Outlet Name */}
                <View style={styles.inputContainer}>
                    <Text style={[TextStyles.h5, { color: themeColors.textColor }]}>User Name</Text>
                    <TextInput
                        style={[styles.input, {
                            borderColor: themeColors.secComponentColor,
                            color: themeColors.mainTextColor,
                            backgroundColor: themeColors.componentColor,
                        }]}
                        value={userName}
                        placeholder="Enter the outlet name"
                        editable={false} // Outlet name is passed and cannot be edited
                    />
                </View>

                {/* Order Number */}
                <View style={styles.inputContainer}>
                    <Text style={[TextStyles.h5, { color: themeColors.textColor }]}>Order Number</Text>
                    <TextInput
                        style={[styles.input, {
                            borderColor: themeColors.secComponentColor,
                            color: themeColors.mainTextColor,
                            backgroundColor: themeColors.componentColor,
                        }]}
                        value={orderNumber}
                        placeholder="Enter the outlet name"
                        editable={false} // Outlet name is passed and cannot be edited
                    />
                </View>

                {/* Complaint Description */}
                <View style={styles.inputContainer}>
                    <Text style={[TextStyles.h5, { color: themeColors.textColor }]}>Complaint Details</Text>
                    <TextInput
                    style={[styles.input, {
                        borderColor: themeColors.secComponentColor,
                        color: themeColors.mainTextColor,
                        backgroundColor: themeColors.componentColor,
                        height: 120
                    }]}
                        value={issue}
                        onChangeText={setIssue}
                        multiline
                        placeholderTextColor={themeColors.textColor}
                        placeholder="Please describe the issue with your order in detail (at least 50 characters)."
                    />
                </View>

                {/* Block User Toggle */}
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[TextStyles.h5, { color: themeColors.mainTextColor }]}>
                        Block User (This user has {complaintCount} complaint{complaintCount !== 1 ? 's' : ''})
                    </Text>
                    <TouchableOpacity onPress={() => setIsBlocked(!isBlocked)}>
                        <Ionicons
                            name='toggle' size={38} style={{ transform: [{ rotate: isBlocked ? '0deg' : '180deg' }] }} color={isBlocked ? themeColors.diffrentColorOrange : themeColors.mainTextColor}
                        />
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: isFormValid ? themeColors.diffrentColorOrange : themeColors.secComponentColor }]}
                    onPress={() => changeOrderStatus(order_Id, "Complaint_Registered", issue)}
                    disabled={!isFormValid || isSubmitting}
                >
                    <Text style={[TextStyles.h5, { color: themeColors.mainTextColor }]}>
                        {isSubmitting ? "Submitting..." : "Submit Complaint"}
                    </Text>
                </TouchableOpacity>
                {AlertWrapper()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        height: 50,
        borderRadius: 8,
        borderWidth: 1,

        paddingHorizontal: 12,
        marginTop: 8,

    },
    submitButton: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
});

export default Complaint;
