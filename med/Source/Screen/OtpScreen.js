import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { API_BASE_URL, VERIFYOTP_ENDPOINT, RESENDOTP_ENDPOINT, LOGIN_ENDPOINT } from '../Constants/Constants';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Components/Colors';
import TextStyles from '../Style/TextStyles';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCustomAlert from '../Components/Alerthook';
import ToastNotification from '../Components/ToastNotification';
import { ThemeContext } from '../Context/ThemeContext';
import { getData } from '../Helper/getData';

const OtpScreen = ({ route }) => {

    const navigation = useNavigation();

    const { contactinfo } = route.params;
    const { password } = route.params;
    const { userRole } = route.params;
    const { showAlert, AlertWrapper } = useCustomAlert();
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()

    const [otp, setOtp] = useState('');
    // const [resendDisabled, setResendDisabled] = useState(false); // State to control resend button

    // Timer for resend functionality (optional)
    const [resendTimer, setResendTimer] = useState(null);

    const { fontFamilies, setUserData } = useContext(GlobalStateContext);

    if (!fontFamilies) {
        return null;
    }

    async function fetchPushToken() {
        const storetokenFCM = (await Notifications.getDevicePushTokenAsync()).data;
        const storetokenEXPO = await registerForPushNotificationsAsync()
        console.log(storetokenFCM, storetokenEXPO)

        try {
            const response = await fetch(`${API_BASE_URL}:${STORETOKENFCM_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storetokenFCM, storetokenEXPO, contactinfo }),
            });

            const data = await response.json();

            if (data.status === 'ok') {
                console.log('Stored FCM');
            } else {
                console.error('Error in Stored FCM');
            }
        } catch (error) {
            console.error('Error in Stored FCM');
        }
    };

    function handleLogin() {
        const userData = {
            // name: username,
            contactinfo: contactinfo,
            // email: email,
            // mobile: phone,
            password: password,
            role: userRole,
        };

        // if (name_verify && email_verify && password_verify) {

        // "http://192.168.110.12:5001/login"
        fetch(`${API_BASE_URL}:${LOGIN_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === "ok") {
                    fetchPushToken();
                    AsyncStorage.setItem('token', data.data);
                    AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
                    getData(setUserData);
                    userRole == 'Seller' ? navigation.navigate("BuyerNavigationStack") : navigation.navigate("BuyerNavigationStack")
                } else {
                    Alert.alert("Direct Login Failed", data.data || "We couldn’t log you in. Please check your credentials and try again.");
                }
            })
            .catch(error => {
                console.log("err", error);
                showAlert({
                    title: "Server Error",
                    message: error.message || "We couldn't verify your credentials due to a server issue. Please try again later.",
                    codeMassage: { code: '503', text: '⚡ Server hiccup! Retry in a bit.' },
                });
            });
        // } else {
        //   Alert.alert("Fill Required Details");
        // }
    }

    const fontstyles = TextStyles();

    // useEffect(() => {
    //     // Optional: Set a timer for resend functionality (e.g., 30 seconds)
    //     // const timer = setTimeout(() => setResendDisabled(false), 30 * 1000); // 30 seconds
    //     setResendTimer(timer);

    //     return () => clearTimeout(timer); // Cleanup function to clear timer on unmount
    // }, []);

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}:${VERIFYOTP_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contactinfo, otp })
            })

            const data = await response.json();

            if (data.status === "ok") {
                // setTitle("Registration Successful")
                // setDescription("Welcome aboard! Your account has been successfully reintialted")
                // setShowToast(true);
                Alert.alert("Registration Successful", "Welcome aboard! Your account has been successfully reintialted");
                // navigation.navigate("LoginScreen");
                // setTimeout(() => {
                //     setShowToast(false);
                // }, 3500);
                await handleLogin();
            } else {
                showAlert({
                    title: "OTP Verification Failed",
                    message: data.data || "The OTP you entered is incorrect or expired. Please try again.",
                    codeMassage: { code: '400', text: '❗ Invalid OTP. Retry now!' },
                });
            }
        } catch (error) {
            console.error("Error:", error);
            showAlert({
                title: "Server Issue",
                message: error || "We couldn’t verify your OTP due to a server problem. Please try again later.",
                codeMassage: { code: '503', text: '⚡ Server hiccup! Retry soon.' },
            });
        }
    };

    const handleResendOtp = async () => {
        // setResendDisabled(true); // Disable resend button temporarily

        // setIsButtonDisabled(true);
        // setRemainingTime(60);
        // Make API call to resend OTP (replace with your actual API call)
        fetch(`${API_BASE_URL}:${RESENDOTP_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ contactinfo })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    setTitle("OTP Resent Successfully!")
                    setDescription("We’ve sent a new OTP to your registered number. Check your inbox and try again!")
                    setShowToast(true);

                    setTimeout(() => {
                        setShowToast(false);
                    }, 3500);

                } else {
                    showAlert({
                        title: data.data && data.data.includes('seconds') ? "OTP Sent Recently" : "Something Went Wrong",
                        message: data.data || "The request went through, but the data isn’t quite right. Check again.",
                        codeMassage: data.data && data.data.includes('seconds')
                            ? { code: '429', text: '⏳ Patience! OTP is on cooldown.' }
                            : { code: '400', text: '⚠️ Data’s off, but request’s fine!' },
                    });
                    // setResendDisabled(false); // Re-enable button if resend fails
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showAlert({
                    title: "Server Error",
                    message: "We couldn’t send the OTP due to a server issue. Please try again after some time.",
                    codeMassage: { code: '503', text: '⚡ Server’s down. Hang tight!' },
                });
            });
    };

    function maskEmail(email) {
        const [localPart, domainPart] = email.split("@");
        const maskedLocal = localPart.slice(0, -4) + "*".repeat(4);
        const maskedDomain = domainPart.slice(0, -3) + "*".repeat(3);
        return `${maskedLocal}@${maskedDomain}`;
    }

    // const [remainingTime, setRemainingTime] = useState(0); // Remaining time for countdown
    // const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Button disable flag

    // const ResendOtp = async () => {
    //     try {
    //         setIsButtonDisabled(true);
    //         setRemainingTime(60);
    //     } catch (error) {
    //         console.log('Error sending OTP:', error);
    //     }
    // };

    // useEffect(() => {
    //     let timer;
    //     if (remainingTime > 0) {
    //         timer = setInterval(() => {
    //             setRemainingTime(prevTime => prevTime - 1);
    //         }, 1000);
    //     } else {
    //         setIsButtonDisabled(false);
    //     }

    //     return () => clearInterval(timer);
    // }, [remainingTime]);
    const [showToast, setShowToast] = useState(false);

    return (
        <View className='p-4 pt-8 h-full' style={{ backgroundColor: themeColors.backGroundColor }}>
            <StatusBar backgroundColor={themeColors.backGroundColor} />

            <View className=' h-full justify-center'>
                {/* <View style={styles.textContainer}> */}

                <Text className=' text-center' style={[fontstyles.h1, { color: themeColors.diffrentColorOrange, }]}>Otp Verification</Text>
                <Text className=' text-center pt-3 pb-8' style={[fontstyles.h5_5, { color: themeColors.diffrentColorOrange, lineHeight: 16, textTransform: 'none' }]}>*If you’re unable to find the OTP in your inbox, kindly check your spam or junk folder.</Text>

                <Text className=' text-center' style={[fontstyles.entryUpper, { color: themeColors.mainTextColor, lineHeight: 25, textTransform: 'none' }]}>We sent your code to</Text>
                {/* <Text className=' text-center' style={[fontstyles.entryUpper, { color: themeColors.mainTextColor, lineHeight: 25, textTransform: 'none' }]}>{maskEmail(contactinfo)}</Text> */}
                <Text className=' text-center pt-1' style={[fontstyles.entryUpper, { color: themeColors.textColor, lineHeight: 25, textTransform: 'none' }]}>{contactinfo}</Text>

                {/* <Text className=' text-center' style={[fontstyles.entryUpper, { color: themeColors.mainTextColor, lineHeight: 45 }]}>code will expire on {resendDisabled ? `(in ${Math.ceil((30 - (Date.now() - resendTimer) / 1000))})` : ''}</Text> */}
                <View className=' mt-5'>
                    <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
                        {/* <Ionicons name={password.length > 1 ? "extension-puzzle" : "extension-puzzle-outline"} size={22} color={password.length > 1 ? themeColors.diffrentColorGreen : themeColors.textColor} /> */}
                        <Ionicons name={otp.length > 1 ? "chatbox-ellipses" : "chatbox-ellipses-outline"} size={22} color={otp.length > 1 ? themeColors.diffrentColorGreen : themeColors.textColor} />
                        <TextInput
                            value={otp}
                            placeholderTextColor={themeColors.textColor}
                            onChangeText={setOtp}
                            placeholder="Enter your OTP"
                            keyboardType="numeric"
                            style={[styles.textInput, { color: themeColors.mainTextColor, }]}
                        />
                    </View>

                    <TouchableOpacity onPress={handleVerifyOtp} className='inputContainer mt-8 flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.diffrentColorOrange }}>
                        <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>Verify OTP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleResendOtp}>
                        <Text className='mb-8 text-right mt-4' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>
                            {/* {isButtonDisabled
                                ? `Resend OTP in ${remainingTime}s`
                                : 'Resend OTP'} */}
                            Resend OTP
                        </Text>
                    </TouchableOpacity>
                    {/* {console.log(userRole)} */}
                </View>
            </View>
            {showToast && (
                <ToastNotification
                    title={title}
                    description={description}
                    showToast={showToast}
                />
            )}
            {AlertWrapper()}
        </View>
    );
};

export default OtpScreen;


const styles = StyleSheet.create({
    // textInputSub: {
    //     // backgroundColor: themeColors.componentColor,
    //     // backgroundColor: themeColors.backGroundColor,
    //     marginTop: -10,
    //     marginLeft: 20,
    //     fontSize: 14,
    //     fontWeight: 900,
    //     paddingHorizontal: 7,
    //     color: themeColors.diffrentColorOrange,
    // },
    textInput: {
        fontSize: 16,
        flex: 1,
        paddingHorizontal: 10,
        // fontFamily: fonts.Light,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        gap: 5,
    },
});