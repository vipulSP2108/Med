import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../Context/ThemeContext';
import { lightTheme, darkTheme } from '../Constants/theme';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import CreateClassScreen from '../Screens/CreateClassScreen';
import JoinClassScreen from '../Screens/JoinClassScreen';
import Fa6Icon from 'react-native-vector-icons/FontAwesome6';
import RoomListScreen from '../Screens/RoomList';
import MessagesScreen from '../Screens/MessagesScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import CustomSideDrawer from '../Components/CustomSideDrawer'; // Import Custom Side Drawer

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  const [isDrawerVisible, setDrawerVisible] = useState(false); // State to control the drawer visibility

  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: currentTheme.backgroundColorHeadbar }}>
        <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: currentTheme.backgroundColorHeadbar,
            },
            headerTintColor: currentTheme.textColor,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="App Name"
            component={RoomListScreen}
            options={{
              title: 'App Name',
              headerLeft: () => (
                <TouchableOpacity
                  style={{ marginHorizontal: 16 }}
                  onPress={() => setDrawerVisible(true)} // Open the custom drawer when clicked
                >
                  <Fa6Icon name="bars" size={22} color={currentTheme.mainTextColor} />
                </TouchableOpacity>
              ),
              headerRight: () => (
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity style={{ marginRight: 16, height: 40, width: 40, borderRadius: '50%', backgroundColor: 'red' }}>
                  {/* <Fa6Icon name="ellipsis-vertical" size={22} color={currentTheme.mainTextColor} /> */}
                </TouchableOpacity>
                <TouchableOpacity style={{ marginHorizontal: 16 }}>
                  <Fa6Icon name="ellipsis-vertical" size={22} color={currentTheme.mainTextColor} />
                </TouchableOpacity>
                </View>
              ),
            }}
            
          />
          <Stack.Screen
            name="Home"
            component={BottomTabNavigator}
            options={({ route, navigation }) => ({
              title: route.params?.classroomName || 'Home',
              headerTitleAlign: 'center',
              headerRight: () => (
                <TouchableOpacity style={{ marginRight: 16 }}>
                  <Fa6Icon name="ellipsis-vertical" size={22} color={currentTheme.mainTextColor} />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <TouchableOpacity
                  style={{ marginLeft: 16 }}
                  onPress={() => setDrawerVisible(true)} // Open the custom drawer when clicked
                >
                  <Fa6Icon name="bars" size={22} color={currentTheme.mainTextColor} />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="CreateClassScreen"
            component={CreateClassScreen}
            options={{
              title: 'CreateClassScreen',
            }}
          />
          <Stack.Screen
            name="JoinClassScreen"
            component={JoinClassScreen}
            options={{
              title: 'JoinClassScreen',
            }}
          />
          <Stack.Screen
            name="Messages"
            component={MessagesScreen}
            options={{
              title: 'Messages',
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile',
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Settings',
            }}
          />
        </Stack.Navigator>
        {/* Custom Drawer Modal */}
        <CustomSideDrawer 
          isVisible={isDrawerVisible} 
          onClose={() => setDrawerVisible(false)} // Close drawer when clicking outside
        />
      </View>
    </NavigationContainer>
  );
};

export default AppNavigator;
