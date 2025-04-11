import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import React, { useContext, useState } from "react";

// import { colors } from "../utils/colors";
// import { fonts } from "../utils/fonts";
import { LinearGradient } from 'expo-linear-gradient';

import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../Components/Colors";
import { API_BASE_URL, REGISTER_ENDPOINT, USERSDATA_ENDPOINT } from "../Constants/Constants";
import { GlobalStateContext } from "../Context/GlobalStateContext";
import Size from "../Components/Size";
import TextStyles from "../Style/TextStyles";
import useCustomAlert from "../Components/Alerthook";
import ToastNotification from "../Components/ToastNotification";
import { ThemeContext } from "../Context/ThemeContext";

const LoginScreen = () => {
  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const { fontFamilies, userRole } = useContext(GlobalStateContext);
  // 192.168.110.12
  if (!fontFamilies) {
    return null;
  }

  const [showToast, setShowToast] = useState(false);
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()

  function handleSubmit() {
    // console.log("Contact Info:", contactinfo);

    if (!contactinfo) {
      setTitle("Password, but make it right!")
      setDescription("Please make sure to enter your password correctly.")
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3500);
      return;
    }

    const userData = {
      name: username,
      contactinfo: String(contactinfo).toLowerCase(),
      password: password,
      role: userRole,
      phone: phone,
    };

    // console.log("User Data:", userData);

    if (name_verify && contactinfo_verify && password_verify && phone_verify) {
      // http://192.168.1.6:5001/register
      fetch(`${API_BASE_URL}:${REGISTER_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      })
        .then(response => response.json())
        .then(data => {
          // console.log("Response Data:", data);
          if (data.status === "ok") {
            Alert.alert("📩 OTP is on its way", "Your OTP has been sent successfully. Please check your messages.");
            navigation.navigate("OtpScreen", {
              contactinfo: userData.contactinfo,
              password: userData.password,
              userRole: userData.role,
            });
          } else {
            showAlert({
              title: "OTP Failed",
              message: data.data || "We couldn’t send the OTP at this moment. Please try again.",
              codeMassage: { code: '500', text: '🚫 User already exists!' },
            });
            console.error(data.data)
          }
        })
        .catch(error => console.log("Error:", error));
    } else {
      if (!name_verify) {
        setTitle("Name, but make it correct!")
        setDescription("Please make sure to fill in your name as per the required format.")
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3500);
      } else if (!contactinfo_verify) {
        setTitle("Oops! Email’s not right. Try again!")
        setDescription("Please provide a valid email address to proceed.")
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3500);
      } else if (!password_verify) {
        setTitle("Password, but make it right!")
        setDescription("Please make sure to enter your password correctly.")
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3500);
      }
    }
  }

  const [username, setusername] = useState('');
  const [name_verify, setname_verify] = useState(null);
  const [password, setpassword] = useState('');
  const [password_verify, setpassword_verify] = useState(null);
  const [contactinfo, setcontactinfo] = useState('');
  const [contactinfo_verify, setcontactinfo_verify] = useState(null);
  const [phone, setphone] = useState('');
  const [phone_verify, setphone_verify] = useState(null);

  function handle_contactinfophone(input) {
    const phoneVar = input.nativeEvent.text;
    setphone(phoneVar);
    setphone_verify(false);
    if (/[6-9]{1}[0-9]{9}/.test(phoneVar)) {
      setphone(phoneVar);
      setphone_verify(true);
    }
  }

  // ----------------- commented if need of both phone and email at same place -----------------
  // function handle_contactinfophone(input) {
  //   const phoneVar = input.nativeEvent.text;
  //   setcontactinfo(phoneVar);
  //   setcontactinfo_verify(false);
  //   if (/[6-9]{1}[0-9]{9}/.test(phoneVar)) {
  //     setcontactinfo(phoneVar);
  //     setcontactinfo_verify(true);
  //   }
  // }

  function handle_contactinfoemail(input) {
    const emailVar = input.nativeEvent.text;
    setcontactinfo(emailVar);
    setcontactinfo_verify(false);

    const emailRegexSeller = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegexUser = /^[a-zA-Z0-9._%+-]+(?:\.[a-zA-Z0-9._%+-]+)*@iitgn\.ac\.in$/;

    if (userRole === 'Seller') {
      if (emailRegexSeller.test(emailVar)) {
        console.log(userRole)
        setcontactinfo(emailVar);
        setcontactinfo_verify(true);
      }
    } else {
      if (emailRegexUser.test(emailVar)) {
        setcontactinfo(emailVar);
        setcontactinfo_verify(true);
      }
    }
  }

  function handle_name(input) {
    const usernameVar = input.nativeEvent.text;
    setusername(usernameVar);
    setname_verify(false);
    if (usernameVar.length >= 3) {
      // console.log("more >3")
      setusername(usernameVar);
      setname_verify(true);
    }
  }

  function handle_password(input) {
    const passwordVar = input.nativeEvent.text;
    setpassword(passwordVar);
    setpassword_verify(false);
    if (/(?=.*\d.*\d.*\d)(?=.*[^a-zA-Z0-9]).{8,}/.test(passwordVar)) {
      setpassword(passwordVar);
      setpassword_verify(true);
    }
  }

  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [EmailPhone, setEmailPhone] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };
  const handleSignup = () => {
    navigation.navigate("LoginScreen");
  };

  const { showAlert, AlertWrapper } = useCustomAlert();

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
        <Text style={[fontstyles.entryUpper, { color: themeColors.diffrentColorOrange, lineHeight: 45 }]}>to get started</Text>
        <Text style={[fontstyles.h1, { color: themeColors.mainTextColor, lineHeight: 45 }]}>Create an account</Text>

        {/* </View> */}
        {/* form  */}
        <View className=' mt-10'>
          <View className='inputContainer flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: name_verify ? themeColors.componentColor : themeColors.backGroundColor }}>
            <Ionicons name={name_verify ? "person" : "person-outline"} size={22} color={name_verify ? themeColors.diffrentColorGreen : themeColors.textColor} />
            <TextInput
              style={[styles.textInput, {color: themeColors.mainTextColor,}]}
              placeholder="Enter your name"
              placeholderTextColor={themeColors.textColor}
              // keyboardType="email-address"
              onChange={txt => handle_name(txt)}
            />
            {/* {username.length < 1 ? null : name_verify ? <Ionicons name={"mail-outline"} size={22} color={themeColors.diffrentColorGreen} /> : <Ionicons name={"mail-outline"} size={22} color={themeColors.diffrentColorOrange} />} */}
          </View>
          {name_verify ? null : <Text className='absolute top-0' style={[styles.textInputSub, fontstyles.h7, { marginTop: -8,     backgroundColor: themeColors.backGroundColor,
    color: themeColors.diffrentColorOrange,}]}>Name must be 3+ characters.</Text>}
          {/* at least 3 */}

          {/* New */}
          <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: contactinfo_verify ? themeColors.componentColor : themeColors.backGroundColor }}>
            <Ionicons name={EmailPhone ? contactinfo_verify ? "mail" : "mail-outline" : contactinfo_verify ? "phone-portrait" : "phone-portrait-outline"} size={22} color={contactinfo_verify ? themeColors.diffrentColorGreen : themeColors.textColor} />
            <TextInput
              style={[styles.textInput, {color: themeColors.mainTextColor,}]}
              placeholder={EmailPhone ? "Enter your Email Address" : "Enter your phone no"}
              placeholderTextColor={themeColors.textColor}
              onChange={EmailPhone ?
                (txt) => handle_contactinfoemail(txt) :
                (txt) => handle_contactinfophone(txt)}
              keyboardType={EmailPhone ? "email-address" : "phone-pad"}
              maxLength={EmailPhone ? null : 10}
            />
            {/* <TouchableOpacity
              onPress={() => {
                setEmailPhone((prev) => !prev);
                // console.log(contactinfo)
                setcontactinfo_verify(false)
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
            {EmailPhone ? contactinfo_verify ? null : <Text className='absolute top-0' style={[fontstyles.h7, styles.textInputSub,{    backgroundColor: themeColors.backGroundColor,
    color: themeColors.diffrentColorOrange,}]}>{userRole === 'Seller' ? 'Email address must be a valid' : 'Email must be of IIT GN domain'}</Text>
              :
              contactinfo_verify ? null : <Text className='absolute top-0' style={[fontstyles.h7, styles.textInputSub,{    backgroundColor: themeColors.backGroundColor,
                color: themeColors.diffrentColorOrange,}]}>Phone number must be 10 digits.</Text>}
          </View>


          {/* Phone Number */}
          <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: phone_verify ? themeColors.componentColor : themeColors.backGroundColor }}>
            <Ionicons name={phone_verify ? "phone-portrait" : "phone-portrait-outline"} size={22} color={phone_verify ? themeColors.diffrentColorGreen : themeColors.textColor} />
            <TextInput
              style={[styles.textInput, {color: themeColors.mainTextColor,}]}
              placeholder={"Enter your phone no"}
              placeholderTextColor={themeColors.textColor}
              onChange={(txt) => handle_contactinfophone(txt)}
              keyboardType={"phone-pad"}
              maxLength={10}
            />
            {/* <TouchableOpacity
              onPress={() => {
                setEmailPhone((prev) => !prev);
                // console.log(contactinfo)
                setcontactinfo_verify(false)
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
            {phone_verify ? null : <Text className='absolute top-0' style={[fontstyles.h7, styles.textInputSub, {
                  backgroundColor: themeColors.backGroundColor,
                  color: themeColors.diffrentColorOrange,
            }]}>Phone number must be 10 digits.</Text>}
          </View>

          <View className='inputContainer mt-5 flex-row items-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: password_verify ? themeColors.componentColor : themeColors.backGroundColor }}>
            <Ionicons name={password_verify ? "extension-puzzle" : "extension-puzzle-outline"} size={22} color={password_verify ? themeColors.diffrentColorGreen : themeColors.textColor} />
            <TextInput
              style={[styles.textInput, {color: themeColors.mainTextColor,}]}
              placeholder="Enter your password"
              placeholderTextColor={themeColors.textColor}
              secureTextEntry={secureEntry}
              onChange={txt => handle_password(txt)}
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
            {password_verify ? null :
              //   <LinearGradient
              //   className=' absolute top-0'
              //   colors={[themeColors.componentColor, themeColors.backGroundColor]}
              //   // start={{ x: 0, y: 0 }}
              //   // end={{ x: 1, y: 0 }}
              //   style={styles.textInputSub}
              // >
              <Text className='absolute top-0' style={[fontstyles.h7, styles.textInputSub, {
                backgroundColor: themeColors.backGroundColor,
                color: themeColors.diffrentColorOrange,
              }]}>Minimum 8 chars, 3 letters, 1 symbol.</Text>
              // </LinearGradient>
            }
          </View>

          <TouchableOpacity onPress={() => handleSubmit()} className='inputContainer mt-8 flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor, backgroundColor: themeColors.diffrentColorOrange }}>
            <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>Register</Text>
          </TouchableOpacity>
          <Text className=' py-3 text-center' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>or continue with</Text>
          <TouchableOpacity
            onPress={() => {
              showAlert({
                title: "Feature in Progress",
                message: "We're working on adding Google direct login. Stay tuned for updates!",
                codeMassage: { code: '202', text: '🔧 Coming Soon with google login!' },
              });
            }}
            className='inputContainer flex-row items-center justify-center px-4 h-14 border-solid border-2 rounded-full' style={{ borderColor: themeColors.secComponentColor }}>
            <Ionicons
              name={"logo-google"}
              color={themeColors.mainTextColor}
              size={20}
            />
            <Text style={[fontstyles.boldh2, { color: themeColors.mainTextColor }]}>  Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Already have an account!</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text className=' underline' style={[fontstyles.h5, { color: themeColors.diffrentColorOrange }]}>Login</Text>
            </TouchableOpacity>
          </View>
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

export default LoginScreen;

const styles = StyleSheet.create({
  textInputSub: {
    
    // backgroundColor: themeColors.componentColor,
    // backgroundColor: themeColors.backGroundColor,
    marginTop: -10,
    marginLeft: 20,
    // fontSize: 14,
    // fontWeight: 900,
    paddingHorizontal: 7,

  },
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