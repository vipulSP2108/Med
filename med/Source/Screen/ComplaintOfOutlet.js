import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView,
} from "react-native";
import React, { useState, useContext } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../Components/Colors";
import { Ionicons } from "@expo/vector-icons";
import TextStyles from "../Style/TextStyles";
import { API_BASE_URL, REGISTERCOMPLAINTS_ENDPOINT } from "../Constants/Constants";
import useCustomAlert from "../Components/Alerthook";
import { GlobalStateContext } from "../Context/GlobalStateContext";
import { ThemeContext } from "../Context/ThemeContext";

const UserComplaint = () => {
    const route = useRoute();
    const name = route.params?.name || '';
    const userId = route.params?.userId || '';
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const { userData } = useContext(GlobalStateContext);
    const navigation = useNavigation();
    const { showAlert, AlertWrapper } = useCustomAlert();

    const [issue, setIssue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false); // Assuming this value is tracked
    const isFormValid = issue.length > 5; // Updated to check 5 characters

    const submitComplaint = async () => {
        if (!isFormValid) {
            showAlert({
                title: "Missing Information",
                message: "Please provide a complaint description with at least 50 characters.",
                codeMassage: { code: '400', text: '⚠️ Don’t leave anything blank! Fill it up!' },
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`${API_BASE_URL}:${REGISTERCOMPLAINTS_ENDPOINT}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    againstName: userId,
                    createrName: userData.contactinfo,
                    _id: Date.now().toString(),
                    issue,
                    isBlocked,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.status === 'ok') {
                Alert.alert("📨 Complaint Submitted", `Your complaint against store ${name} has been successfully submitted. We will get back to you within a few days.`)
                navigation.goBack();
            } else {
                console.error('Error submitting complaint:', data);
            }
        } catch (error) {
            console.error('Error submitting complaint:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to submit complaint. Please try again later.',
                codeMassage: { code: '500', text: error.message },
            });
        } finally {
            setIsSubmitting(false);
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

                {/* User Name */}
                <View style={styles.inputContainer}>
                    <Text style={[TextStyles.h5, { color: themeColors.textColor }]}>Outlet Name</Text>
                    <TextInput
                        style={[styles.input, {
                            borderColor: themeColors.secComponentColor,
                            color: themeColors.mainTextColor,
                            backgroundColor: themeColors.componentColor,
                        }]}
                        value={name}
                        placeholder="User Name"
                        editable={false} // User name is passed and cannot be edited
                    />
                </View>

                {/* User ID */}
                <View style={styles.inputContainer}>
                    <Text style={[TextStyles.h5, { color: themeColors.textColor }]}>User ID</Text>
                    <TextInput
                        style={[styles.input, {
                            borderColor: themeColors.secComponentColor,
                            color: themeColors.mainTextColor,
                            backgroundColor: themeColors.componentColor,
                        }]}
                        value={userId}
                        placeholder="User ID"
                        editable={false} // User ID is passed and cannot be edited
                    />
                </View>

                {/* Complaint Description */}
                <View style={styles.inputContainer}>
                    <Text style={[TextStyles.h5, { color: themeColors.textColor }]}>Complaint Details</Text>
                    <TextInput
                        style={[styles.input, {
                            borderColor: themeColors.secComponentColor,
                            color: themeColors.mainTextColor,
                            backgroundColor: themeColors.componentColor, height: 120
                        }]}
                        value={issue}
                        onChangeText={setIssue}
                        multiline
                        placeholderTextColor={themeColors.textColor}
                        placeholder="Please describe the issue with the user in detail (at least 50 characters)."
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: isFormValid ? themeColors.diffrentColorOrange : themeColors.secComponentColor }]}
                    onPress={submitComplaint}
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

export default UserComplaint;


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