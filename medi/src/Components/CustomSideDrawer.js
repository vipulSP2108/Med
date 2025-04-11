import React, { useRef, useEffect, useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  ScrollView,
  StyleSheet,
  FlatList
} from 'react-native';
import Fa6Icon from 'react-native-vector-icons/FontAwesome6';
import { AppContext } from '../Context/AppContext';
import { useNavigation, useTheme } from '@react-navigation/native';
import { darkTheme, lightTheme } from '../Constants/theme';

const CustomSideDrawer = ({ isVisible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current; // Slide in from left

  const { theme } = useTheme();
  const navigation = useNavigation();

  const currentTheme = theme === 'light' ? darkTheme : lightTheme;

  const { roomDetails } = useContext(AppContext);
  // console.log(roomDetails)
  const [teaching, setTeaching] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  useEffect(() => {
    // Process room details and classify them based on accessType
    const teachingRooms = [];
    const enrolledRooms = [];
    roomDetails.forEach(room => {
      if (room.accessType === 'owner') {
        teachingRooms.push(room);
      } else {
        enrolledRooms.push(room);
      }
    });
    setTeaching(teachingRooms);
    setEnrolled(enrolledRooms);
  }, [roomDetails]);

  const openDrawer = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.spring(slideAnim, {
      toValue: -300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    isVisible ? openDrawer() : closeDrawer();
  }, [isVisible]);

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose} animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBackground} onPress={onClose} />
        <Animated.View style={[styles.drawerContainer, { backgroundColor: currentTheme.backgroundColor, transform: [{ translateX: slideAnim }] }]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={[styles.title, { color: currentTheme.mainTextColor, borderBottomColor: currentTheme.textColor }]}>App Name</Text>

            {/* Navigation Links */}
            <TouchableOpacity style={[styles.navItem]}>
              <Fa6Icon name="home" size={20} color={currentTheme.mainTextColor} />
              <Text style={[styles.navText, { color: currentTheme.mainTextColor }]}>Rooms</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navItem, { borderColor: 'rgb(355, 355, 355)', borderWidth: 2, borderStartWidth: 0, borderTopRightRadius: 100, borderBottomRightRadius: 100, marginRight: 12, backgroundColor: 'rgba(355, 355, 355, 0.2)' }]}>
              <Fa6Icon name="calendar" size={20} color={currentTheme.mainTextColor} />
              <Text style={[styles.navText, { color: currentTheme.mainTextColor }]}>Bookings</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.navItem}>
              <Fa6Icon name="bell" size={20} color="#fff" />
              <Text style={styles.navText}>Notifications</Text>
            </TouchableOpacity> */}


            {/* Section: Teachers */}
            {/* <View style={styles.sectionContainer}> */}
            <View style={{ paddingVertical: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ height: 1, backgroundColor: currentTheme.textColor, width: 20 }} />
              <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>TEACHING</Text>
              <View style={{ height: 1, backgroundColor: currentTheme.textColor, flex: 1 }} />
            </View>
            {teaching.map((item, index) => (
              <TouchableOpacity 
              onPress={() => navigation.navigate('Home', { data: item, classroomName: item.roomName })}
              style={[styles.navItemRooms,]}
              >
                <Text style={{ backgroundColor: currentTheme.componentColor, color: currentTheme.mainTextColor, height: 35, width: 35, textAlign: 'center', verticalAlign: 'middle', borderRadius: 100 }}>{item.roomName.charAt(0)}</Text>
                <View >
                  <Text style={[styles.subNavText, { color: currentTheme.mainTextColor }]}>{item.roomName}</Text>
                  {item.subRoomName && <Text style={[styles.subText, { lineHeight: 13, color: currentTheme.textColor }]}>{item.subRoomName}</Text>}
                </View>
              </TouchableOpacity>
            ))}

            {/* Section: Students */}
            <View style={{ paddingVertical: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ height: 1, backgroundColor: currentTheme.textColor, width: 20 }} />
              <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>YOUR ROOMS</Text>
              <View style={{ height: 1, backgroundColor: currentTheme.textColor, flex: 1 }} />
            </View>
            {enrolled.map((item, index) => (
              <TouchableOpacity style={[styles.navItemRooms,]}>
                <Text style={{ backgroundColor: currentTheme.componentColor, color: currentTheme.mainTextColor, height: 35, width: 35, textAlign: 'center', verticalAlign: 'middle', borderRadius: 100 }}>{item.roomName.charAt(0)}</Text>
                <View >
                  <Text style={[styles.subNavText, { color: currentTheme.mainTextColor }]}>{item.roomName}</Text>
                  {item.subRoomName && <Text style={[styles.subText, { lineHeight: 13, color: currentTheme.textColor }]}>{item.subRoomName}</Text>}
                </View>
              </TouchableOpacity>
            ))}

            <Text style={[{ borderBottomWidth: 2, color: currentTheme.mainTextColor, borderBottomColor: currentTheme.textColor }]}></Text>
            {/* <View style={{ marginBottom: 10, marginTop: 20, color: currentTheme.mainTextColor, borderBottomColor: currentTheme.textColor, borderTopWidth: 2 }} /> */}
            {/* Navigation Links */}
            <TouchableOpacity style={[styles.navItem]}>
              <Fa6Icon name="gear" size={20} color={currentTheme.mainTextColor} />
              <Text style={[styles.navText, { color: currentTheme.mainTextColor }]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navItem,]}>
              <Fa6Icon name="circle-question" size={20} color={currentTheme.mainTextColor} />
              <Text style={[styles.navText, { color: currentTheme.mainTextColor }]}>Help</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayBackground: {
    flex: 1,
  },
  drawerContainer: {
    width: 300,
    height: '100%',
    paddingTop: 20,
    // paddingRight: 12,
    position: 'absolute',
    left: 0,
  },
  // scrollContainer: {
  //   paddingHorizontal: 20,
  // },
  title: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 2,
  },
  navItem: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 15,
  },
  navItemRooms: {
    paddingVertical: 13,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 15,
  },
  navText: {
    fontSize: 18,
    marginLeft: 15,
  },
  subNavText: {
    fontSize: 16,
    marginLeft: 15,
  },
  subText: {
    fontSize: 14,
    marginLeft: 15,
  },
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    paddingLeft: 7,
    paddingRight: 7,
    fontSize: 14,
    color: '#bbb',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 12,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#888',
    color: '#fff',
    fontSize: 18,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    // lineHeight: 32,
    // marginRight: 10,
  },
  addPeople: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default CustomSideDrawer;
