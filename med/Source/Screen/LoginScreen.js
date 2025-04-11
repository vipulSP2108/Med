import {
  Alert,
  BackHandler,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";

// import { colors } from "../utils/colors";
// import { fonts } from "../utils/fonts";
import { LinearGradient } from 'expo-linear-gradient';

import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Colors from "../Components/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, LOGIN_ENDPOINT, RESENDOTP_ENDPOINT, STORETOKENFCM_ENDPOINT } from "../Constants/Constants";
import { GlobalStateContext } from "../Context/GlobalStateContext";
import Size from "../Components/Size";
import TextStyles from "../Style/TextStyles";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import ToastNotification from "../Components/ToastNotification";
import useCustomAlert from "../Components/Alerthook";
import { ThemeContext } from "../Context/ThemeContext";
import { getData } from "../Helper/getData";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

const LoginScreen = () => {
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  // 192.168.110.12
  const { fontFamilies, userRole, setUserRole, setUserData } = useContext(GlobalStateContext);

  if (!fontFamilies) {
    return null;
  }

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
          if (data.status === 'notVerified') {
            showAlert({
              title: "Email Not Verified",
              message: "Your email hasn’t been verified yet. Please verify it to proceed.",
              codeMassage: { code: '401', text: '📧 Verify your email to continue!' },
              buttons: [
                {
                  icon: 'shield-half',
                  text: "Don't",
                  onPress: () => null,
                  styleColor: '#FD4851'
                },
                {
                  styleColor: '#2CD007',
                  icon: 'shield-checkmark',
                  text: "Verify",
                  onPress: async () => {
                    const handleResendOtp = async () => {
                      try {
                        // setResendDisabled(true); // Disable resend button temporarily

                        const response = await fetch(`${API_BASE_URL}:${RESENDOTP_ENDPOINT}`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({ contactinfo })
                        });

                        const data = await response.json();

                        if (data.status === "ok") {
                          setShowToast(true);

                          setTimeout(() => {
                            setShowToast(false);
                          }, 2500);
                          Alert.alert("OTP sent successfully!", "Your OTP has been sent successfully. Please check your messages.");
                          navigation.navigate("OtpScreen", { contactinfo: userData.contactinfo });
                        } else {
                          showAlert({
                            title: "OTP Failed",
                            message: data.data || "We couldn’t send the OTP at this moment. Please try again.",
                            codeMassage: { code: '500', text: '🚫 OTP failed! Retry later.' },
                          });
                          console.error("Error:", data.data);
                          // setResendDisabled(false); // Re-enable button
                        }
                      } catch (error) {
                        showAlert({
                          title: "Server Issue",
                          message: "We couldn’t send the OTP due to a server issue. Please try again later.",
                          codeMassage: { code: '503', text: '⚡ Server’s down. OTP on hold!' },
                        });
                        console.error("Error:", error)
                        // setResendDisabled(false); // Re-enable button
                      }
                    };

                    await handleResendOtp();
                  }
                }
              ],
              additional: [
                { head: "Don't", head2: "navigate:null" },
                { head: "Verify", head2: "navigate:otp" }
              ]
            });
          }
          else {
            showAlert({
              title: "Incorrect Credentials",
              message: data.data || "The credentials you entered are incorrect. Please try again.",
              codeMassage: { code: '401', text: '💢 Oops! Check your info and retry.' },
            });
          }
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

  // const [username, setusername] = useState('');
  // const [name_verify, setname_verify] = useState(null);
  const [password, setpassword] = useState('');
  // const [password_verify, setpassword_verify] = useState(null);
  const [contactinfo, setcontactinfo] = useState('');
  // const [contactinfo_verify, setcontactinfo_verify] = useState(null);
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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

  // function handle_contactinfophone(input) {
  //   const phoneVar = input.nativeEvent.text;
  //   setcontactinfo(phoneVar);
  //   setcontactinfo_verify(false);
  //   if (/[6-9]{1}[0-9]{9}/.test(phoneVar)) {
  //     setcontactinfo(phoneVar);
  //     setcontactinfo_verify(true);
  //   }
  // }

  // function handle_contactinfoemail(input) {
  //   const emailVar = input.nativeEvent.text;
  //   setcontactinfo(emailVar);
  //   setcontactinfo_verify(false);
  //   if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVar)) {
  //     setcontactinfo(emailVar);
  //     setcontactinfo_verify(true);
  //   }
  // }

  // function handle_name(input) {
  //   const usernameVar = input.nativeEvent.text;
  //   setusername(usernameVar);
  //   setname_verify(false);
  //   if (usernameVar.length >= 3) {
  //     console.log("more >3")
  //     setusername(usernameVar);
  //     setname_verify(true);
  //   }
  // }

  // function handle_password(input) {
  //   const passwordVar = input.nativeEvent.text;
  //   setpassword(passwordVar);
  //   setpassword_verify(false);
  //   if (/(?=.*\d.*\d.*\d)(?=.*[^a-zA-Z0-9]).{8,}/.test(passwordVar)) {
  //     setpassword(passwordVar);
  //     setpassword_verify(true);
  //   }
  // }

  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [EmailPhone, setEmailPhone] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const { showAlert, AlertWrapper } = useCustomAlert();

  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSignup = () => {
    navigation.navigate("SignupScreen");
  };

  const fontstyles = TextStyles();
  return (
    <View className='p-4 pt-8 h-full' style={{ backgroundColor: themeColors.backGroundColor }}>
      {/* <TouchableOpacity className=' h-10 w-10 justify-center items-center rounded-full' style={{ backgroundColor: themeColors.diffrentColorOrange }} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={themeColors.backGroundColor}
          size={22}
        />
      </TouchableOpacity> */}
      <StatusBar backgroundColor={themeColors.backGroundColor} />

      <View className=' h-full justify-center'>
        {/* <View style={styles.textContainer}> */}
        <Text style={[fontstyles.entryUpper, { color: themeColors.mainTextColor, lineHeight: 45 }]}>Welcome Back!</Text>
        <Text style={[fontstyles.h1, { color: themeColors.diffrentColorOrange, lineHeight: 45 }]}>Log to continue</Text>
        {/* </View> */}
        {/* form  */}
        <View className=' mt-10'>
          {/* <View className='inputContainer flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
            <Ionicons name={name_verify ? "person" : "person-outline"} size={22} color={name_verify ? themeColors.diffrentColorGreen : themeColors.textColor} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your name"
              placeholderTextColor={themeColors.textColor}
              // keyboardType="email-address"
              onChange={txt => handle_name(txt)}
            />
          </View>
          {name_verify ? null : <Text className='absolute top-0' style={[styles.textInputSub, { marginTop: -9 }]}>Name must be 3+ characters.</Text>} */}
          <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
            <Ionicons name={EmailPhone ? contactinfo.length > 1 ? "mail" : "mail-outline" : contactinfo.length ? "phone-portrait" : "phone-portrait-outline"} size={22} color={contactinfo.length ? themeColors.diffrentColorGreen : themeColors.textColor} />
            <TextInput
              style={[styles.textInput, { color: themeColors.mainTextColor, }]}
              placeholder={EmailPhone ? "Enter your Email Address" : "Enter your phone no"}
              placeholderTextColor={themeColors.textColor}
              onChange={(txt) =>
                setcontactinfo(txt.nativeEvent.text.toLowerCase())
                // (txt) => handle_contactinfophone(txt)
              }
              keyboardType={EmailPhone ? "email-address" : "phone-pad"}
              maxLength={EmailPhone ? null : 10}
            />
            {/* <TouchableOpacity
              onPress={() => {
                setEmailPhone((prev) => !prev);
                // console.log(contactinfo)
                // setcontactinfo_verify(false)
                setcontactinfo('')
                // console.log(contactinfo)
              }}
              style={styles.icon}
            >
              {EmailPhone ? (
                <Ionicons
                  name="swap-vertical-outline"
                  size={22}
                  color={themeColors.textColor}
                />
              ) : (
                <Ionicons
                  style={{ transform: [{ scaleX: -1 }] }}
                  name="swap-vertical-outline"
                  size={22}
                  color={themeColors.textColor}
                />
              )}
            </TouchableOpacity> */}
            {/* {EmailPhone ? <Text className='absolute top-0' style={styles.textInputSub}>Email address must be a valid</Text>
              :
              contactinfo_verify ? null : <Text className='absolute top-0' style={styles.textInputSub}>Phone number must be 10 digits.</Text>} */}
          </View>

          <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.componentColor }}>
            <Ionicons name={password.length > 1 ? "extension-puzzle" : "extension-puzzle-outline"} size={22} color={password.length > 1 ? themeColors.diffrentColorGreen : themeColors.textColor} />
            <TextInput
              style={[styles.textInput, { color: themeColors.mainTextColor, }]}
              placeholder="Enter your password"
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
            {/* {password_verify ? null :
              //   <LinearGradient
              //   className=' absolute top-0'
              //   colors={[themeColors.componentColor, themeColors.backGroundColor]}
              //   // start={{ x: 0, y: 0 }}
              //   // end={{ x: 1, y: 0 }}
              //   style={styles.textInputSub}
              // >
              <Text className='absolute top-0' style={styles.textInputSub}>Minimum 8 chars, 3 letters, 1 symbol.</Text>
              // </LinearGradient>
            } */}
          </View>

          <TouchableOpacity onPress={() => {
            navigation.navigate("ForgotScreen", {
              contactinfo: contactinfo,
              userRole: userRole,
            });
          }}>
            <Text className='mb-8 text-right mt-4' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleLogin()} className='inputContainer mt-8 flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.diffrentColorOrange }}>
            <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>Login</Text>
          </TouchableOpacity>
          <Text className=' py-3 text-center' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>or continue with</Text>
          {/* {console.log(userRole)} */}
          <TouchableOpacity className='inputContainer flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor }}
            onPress={() => {
              showAlert({
                title: "Feature in Progress",
                message: "We're working on adding Google direct login. Stay tuned for updates!",
                codeMassage: { code: '202', text: '🔧 Coming Soon with google login!' },
              });
            }}
          // onPress={() => userRole == 'Seller' ? navigation.navigate("BuyerNavigationStack") : navigation.navigate("BuyerNavigationStack")}
          >
            <Ionicons
              name={"logo-google"}
              color={themeColors.mainTextColor}
              size={20}
            />
            <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>  Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Don’t have an account?</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text className=' underline' style={[fontstyles.h5, { color: themeColors.diffrentColorOrange }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {AlertWrapper()}
      {showToast && (
        <ToastNotification
          title="Contact Info Missing!"
          description="We couldn’t contact as phone number is not provided."
          showToast={showToast}
        />
      )}
    </View>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  // textInputSub: {
  //   // backgroundColor: themeColors.componentColor,
  //   // backgroundColor: themeColors.backGroundColor,
  //   marginTop: -10,
  //   marginLeft: 20,
  //   fontSize: 14,
  //   fontWeight: 900,
  //   paddingHorizontal: 7,
  //   color: themeColors.diffrentColorOrange,
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