import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { API_BASE_URL, VERIFYOTP_ENDPOINT, RESENDOTP_ENDPOINT, LOGIN_ENDPOINT, SETNEWPASSWORD_ENDPOINT, STORETOKENFCM_ENDPOINT } from '../Constants/Constants';
import { useNavigation } from '@react-navigation/native';
import Colors from '../Components/Colors';
import TextStyles from '../Style/TextStyles';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCustomAlert from '../Components/Alerthook';
import { ThemeContext } from '../Context/ThemeContext';
import { getData } from '../Helper/getData';

const ForgotScreen = ({ route }) => {

    const navigation = useNavigation();

    const { contactinfo } = route.params || {};
    const { userRole } = route.params || {};
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const [emailset, setEmailset] = useState(contactinfo || '');

    const [hide, sethide] = useState(false);
    const [password, setpassword] = useState('');
    const [otp, setOtp] = useState('');
    const [secureEntry, setSecureEntry] = useState(true);

    const { showAlert, AlertWrapper } = useCustomAlert();

    const { fontFamilies, setUserData } = useContext(GlobalStateContext);

    if (!fontFamilies) {
        return null;
    }

    const fontstyles = TextStyles();

    const SendOtp = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}:${RESENDOTP_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ contactinfo: emailset.toLowerCase() })
            });

            const data = await response.json();
            // console.log(data)
            if (response.ok) {
                if (data.status === "ok") {
                    showAlert({
                        title: "OTP Resent Successfully!",
                        message: "We’ve sent a new OTP to your registered number. Check your inbox and try again!",
                        codeMassage: { code: '200', text: '🔁 OTP reloaded! It’s on its way!' },
                    });
                    sethide(true);
                } else {
                    showAlert({
                        title: "Something Went Wrong",
                        message: data.data || "The request went through, but the data isn’t quite right. Check again.",
                        codeMassage: { code: '400', text: '⚠️ Data’s off, but request’s fine!' },
                    });
                }
            } else {
                // throw new Error("Failed to resend OTP.");
                showAlert({
                    title: "Server Error",
                    message: data.data || "Something went wrong on our end. Please try again later.",
                    codeMassage: { code: '500', text: '⚡ Server hiccup! We’re on it!' },
                });

            }
        } catch (error) {
            // console.error("Error:", error);
            showAlert({
                title: "Server Error",
                message: error.data || "Oops! Something went wrong on our end. Please try again later.",
                codeMassage: { code: '500', text: '🔥 Uh-oh! The server is on strike.' },
            });
        }
    };

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
                body: JSON.stringify({ storetokenFCM, storetokenEXPO, contactinfo: emailset.toLowerCase() }),
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
            contactinfo: emailset.toLowerCase(),
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

    const handlePasswordChange = async () => {
        // Ensure that the required fields are available
        if (!otp || !password) {
            showAlert({
                title: "Missing Information",
                message: "OTP and New Password are required to continue.",
                codeMassage: { code: '400', text: '⚠️ Fill in both OTP and new password!' },
            });
            return;
        }

        // console.log(emailset, otp, password, userRole)
        try {
            console.log('asd')
            const response = await fetch(`${API_BASE_URL}:${SETNEWPASSWORD_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contactinfo: emailset.toLowerCase(),  // Ensure emailset is the contact info
                    otp: otp,
                    newpassword: password,
                    role: userRole  // Make sure this is the correct role, change as needed
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status === "ok") {
                    showAlert({
                        title: "Password Updated!",
                        message: "Your password has been updated successfully. You can now log in with the new one.",
                        codeMassage: { code: '200', text: '🔑 Password changed! You’re all set.' },
                    });
                    // navigation.navigate()
                    // sethide(true);  // Hide fields or navigate if needed
                    await handleLogin();
                }
                else {
                    showAlert({
                        title: "Password Update Issue",
                        message: data.data || "Your password was updated, but there was an issue with the response data. Please try again.",
                        codeMassage: { code: '500', text: '⚠️ All good with the password, but data’s a bit off!' },
                    });
                    // Handle backend error response
                }
            } else {
                throw new Error(data.data || "An error occurred. Please try again.");
            }

        } catch (error) {
            console.error("Error:", error);
            showAlert({
                title: "Password Update Issue",
                message: error.message || "Your password was updated, but there was an issue with the response data. Please try again.",
                codeMassage: { code: '500', text: '⚠️ All good with the password, but data’s a bit off!' },
            });
        }
    };

    const handleResendOtp = async () => {
        fetch(`${API_BASE_URL}:${RESENDOTP_ENDPOINT}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ contactinfo: emailset.toLowerCase() })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "ok") {
                    showAlert({
                        title: "OTP Resent!",
                        message: "A new OTP has been sent to your number. Check your inbox and try again.",
                        codeMassage: { code: '200', text: '🔁 OTP on its way!' },
                    });
                } else {
                    showAlert({
                        title: "OTP Resend Failed",
                        message: data.data || "There was an issue resending the OTP. Please try again later.",
                        codeMassage: { code: '500', text: '⚡ Server glitch! OTP didn’t make it.' },
                    });
                    setResendDisabled(false); // Re-enable button if resend fails
                }
            })
            .catch(error => console.error("Error:", error));
    };


    return (
        <View className='p-4 pt-8 h-full' style={{ backgroundColor: themeColors.backGroundColor }}>
            <StatusBar backgroundColor={themeColors.backGroundColor} />

            <View className=' h-full w-full justify-center'>
                {/* <View style={styles.textContainer}> */}

                <Text className=' text-center' style={[fontstyles.entryUpper, { color: themeColors.mainTextColor, lineHeight: 45 }]}>Don't worry!</Text>
                <Text className=' text-center' style={[fontstyles.h1, { color: themeColors.diffrentColorOrange, lineHeight: 45 }]}>{'Reset to continue'}</Text>
                <Text className=' text-center pt-3' style={[fontstyles.h5_5, { color: themeColors.diffrentColorOrange, lineHeight: 16, textTransform: 'none' }]}>*If you’re unable to find the OTP in your inbox, kindly check your spam or junk folder.</Text>
                {/* <Text className=' text-center' style={[fontstyles.h1, { color: themeColors.diffrentColorOrange, lineHeight: 45 }]}>{hide ? 'Enter New Password' : 'Enter your email'}</Text> */}

                {/* <Text className=' text-center' style={[fontstyles.h1, { color: themeColors.diffrentColorOrange }]}>{hide ? 'Set New Password' : 'Send Otp'}</Text> */}
                {/* <Text className=' text-center' style={[fontstyles.entryUpper, { color: themeColors.mainTextColor, lineHeight: 45 }]}>code will expire on {resendDisabled ? `(in ${Math.ceil((30 - (Date.now() - resendTimer) / 1000))})` : ''}</Text> */}
                <View className=' mt-10'>

                    <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
                        <Ionicons name={emailset.length > 1 ? "mail" : "mail-outline"} size={22} color={emailset.length ? themeColors.diffrentColorGreen : themeColors.textColor} />
                        <TextInput
                            value={emailset}
                            style={[styles.textInput, { color: themeColors.mainTextColor, }]}
                            placeholder={"Enter your Email Address"}
                            placeholderTextColor={themeColors.textColor}
                            onChange={(e) => setEmailset(e.nativeEvent.text)}  // Correct way to extract the text
                        />
                    </View>

                    {hide &&
                        <View>
                            <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
                                <Ionicons name={otp.length > 1 ? "chatbox-ellipses" : "chatbox-ellipses-outline"} size={22} color={otp.length ? themeColors.diffrentColorGreen : themeColors.textColor} />
                                <TextInput
                                    value={otp}
                                    style={[styles.textInput, { color: themeColors.mainTextColor, }]}
                                    placeholder={"Enter your OTP"}
                                    placeholderTextColor={themeColors.textColor}
                                    // onChange={setOtp}
                                    onChange={(e) => setOtp(e.nativeEvent.text)}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
                                <Ionicons name={password.length > 1 ? "extension-puzzle" : "extension-puzzle-outline"} size={22} color={password.length ? themeColors.diffrentColorGreen : themeColors.textColor} />
                                <TextInput
                                    style={[styles.textInput, { color: themeColors.mainTextColor, }]}
                                    placeholder={"Enter New password"}
                                    placeholderTextColor={themeColors.textColor}
                                    secureTextEntry={secureEntry}
                                    // onChange={txt => setpassword(txt.nativeEvent.text)}
                                    onChange={(e) => setpassword(e.nativeEvent.text)}
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
                        </View>
                    }

                    <TouchableOpacity onPress={hide ? handlePasswordChange : SendOtp} className='inputContainer mt-8 flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.diffrentColorOrange }}>
                        <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>{hide ? 'Set Password' : 'Send OTP'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleResendOtp}>
                        <Text className='mb-8 text-right mt-4' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>
                            {/* {isButtonDisabled
                                                    ? `Resend OTP in ${remainingTime}s`
                                                    : 'Resend OTP'} */}
                            Resend OTP
                        </Text>
                    </TouchableOpacity>
                </View>
                {AlertWrapper()}
            </View>
        </View>
    );
};

export default ForgotScreen;

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