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
import { ThemeContext } from '../Context/ThemeContext';

const ForgotScreen_EnterPassword = () => {

    const navigation = useNavigation();

    // const { contactinfo } = route.params;

    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [secureEntry, setSecureEntry] = useState(true);
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const [resendDisabled, setResendDisabled] = useState(false); // State to control resend button

    // Timer for resend functionality (optional)
    const [resendTimer, setResendTimer] = useState(null);
    const { showAlert, AlertWrapper } = useCustomAlert();

    const { fontFamilies } = useContext(GlobalStateContext);

    if (!fontFamilies) {
        return null;
    }

    const fontstyles = TextStyles();

    useEffect(() => {
        // Optional: Set a timer for resend functionality (e.g., 30 seconds)
        const timer = setTimeout(() => setResendDisabled(false), 30 * 1000); // 30 seconds
        setResendTimer(timer);

        return () => clearTimeout(timer); // Cleanup function to clear timer on unmount
    }, []);

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
                showAlert({
                    title: "Registration Successful!",
                    message: "You’ve successfully registered. Welcome aboard!",
                    codeMassage: { code: '200', text: '🎉 Welcome! You’re all set to go!' },
                });
            } else {
                showAlert({
                    title: "OTP Verification Failed",
                    message: "The OTP you entered is incorrect. Please try again.",
                    codeMassage: { code: '400', text: '💢 OTP mismatch. Double-check and retry!' },
                });
            }
        } catch (error) {
            console.error("Error:", error);
            showAlert({
                title: "Server Error",
                message: error || "Something went wrong on our end. Please try again later.",
                codeMassage: { code: '500', text: '⚡ Server’s on a break. We’ll be back soon!' },
            });
        }
    };

    const handleResendOtp = async () => {
        setResendDisabled(true); // Disable resend button temporarily

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
                    showAlert({
                        title: "OTP Resent Successfully!",
                        message: "We’ve sent a new OTP to your registered number. Check your inbox and try again!",
                        codeMassage: { code: '200', text: '🔁 OTP reloaded! It’s on its way!' },
                    });
                } else {
                    showAlert({
                        title: "Something Went Wrong",
                        message: data.data || "The request went through, but the data isn’t quite right. Check again.",
                        codeMassage: { code: '400', text: '⚠️ Data’s off, but request’s fine!' },
                    });
                    setResendDisabled(false); // Re-enable button if resend fails
                }
            })
            .catch(error => console.error("Error:", error));
    };

    // function maskEmail(email) {
    //     const [localPart, domainPart] = email.split("@");
    //     const maskedLocal = localPart.slice(0, -4) + "*".repeat(4);
    //     const maskedDomain = domainPart.slice(0, -3) + "*".repeat(3);
    //     return `${maskedLocal}@${maskedDomain}`;
    // }

    return (
        <View className='p-4 pt-8 h-full' style={{ backgroundColor: themeColors.backGroundColor }}>
            <StatusBar backgroundColor={themeColors.backGroundColor} />

            <View className=' h-full justify-center'>
                {/* <View style={styles.textContainer}> */}

                <Text className=' text-center' style={[fontstyles.h1, { color: themeColors.diffrentColorOrange }]}>Reset Password</Text>
                {/* <Text className=' text-center' style={[fontstyles.entryUpper, { color: themeColors.mainTextColor, lineHeight: 45 }]}>code will expire on {resendDisabled ? `(in ${Math.ceil((30 - (Date.now() - resendTimer) / 1000))})` : ''}</Text> */}
                <View className=' mt-10'>
                    <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
                        <Ionicons name={email.length > 1 ? "mail" : "mail-outline"} size={22} color={email.length ? themeColors.diffrentColorGreen : themeColors.textColor} />
                        <TextInput
                            style={[styles.textInput, {color: themeColors.mainTextColor,}]}
                            placeholder={"Enter your Email Address"}
                            placeholderTextColor={themeColors.textColor}
                            onChange={(txt) =>
                                setEmail(txt.nativeEvent.text.toLowerCase())
                                // (txt) => handle_contactinfophone(txt)
                            }
                        />
                    </View>

                    <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
                        <Ionicons name={email.length > 1 ? "chatbox-ellipses" : "chatbox-ellipses-outline"} size={22} color={email.length ? themeColors.diffrentColorGreen : themeColors.textColor} />
                        <TextInput
                            value={otp}
                            style={[styles.textInput, {color: themeColors.mainTextColor,}]}
                            placeholder={"Enter your OTP"}
                            placeholderTextColor={themeColors.textColor}
                            onChange={setOtp}
                            keyboardType="numeric"
                        />
                    </View>

                    <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
                        <Ionicons name={password.length > 1 ? "extension-puzzle" : "extension-puzzle-outline"} size={22} color={email.length ? themeColors.diffrentColorGreen : themeColors.textColor} />
                        <TextInput
                            style={[styles.textInput, {color: themeColors.mainTextColor,}]}
                            placeholder={"Enter your password"}
                            placeholderTextColor={themeColors.textColor}
                            secureTextEntry={secureEntry}
                            onChange={txt => setpassword(txt.nativeEvent.text)}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                setSecureEntry((prev) => !prev);
                            }}
                            style={styles.icon}
                        >
                            {secureEntry ? (
                                <Ionicons
                                    name="eye-outline"
                                    size={22}
                                    color={themeColors.textColor}
                                />
                            ) : (
                                <Ionicons
                                    name="eye-off-outline"
                                    size={22}
                                    color={themeColors.textColor}
                                />
                            )}
                        </TouchableOpacity>
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
            {AlertWrapper()}
        </View>
    );
};

export default ForgotScreen_EnterPassword;

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
    // footerContainer: {
    //     flexDirection: "row",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     marginVertical: 20,
    //     gap: 5,
    // },
});