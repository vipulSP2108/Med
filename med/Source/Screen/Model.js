// Model.js
import React, { useContext, useState } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import Colors from '../Components/Colors';
import { useNavigation } from '@react-navigation/native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import CartContent from '../Components/CartContent'; // Import the CartContent component
import { ThemeContext } from '../Context/ThemeContext';

export default function Model() {
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
const { themeColors, toggleTheme } = useContext(ThemeContext);
    return { 
        show, 
        hide, 
        RenderModel: () => (
            <Modal
                visible={visible}
                onRequestClose={hide}
                animationType="fade"
                transparent
            >
                <View className='w-full h-full' style={{ flex: 1, backgroundColor: 'rgba(355, 355, 355, 0.3)' }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={hide} />
                    {/* <View className='absolute w-full bottom-0 p-3' style={{ maxHeight: 400, borderTopRightRadius: 21, borderTopLeftRadius: 21, backgroundColor: Colors.dark.colors.componentColor }}> */}
                        <CartContent setVisible={setVisible} /> {/* Use the CartContent component */}
                    {/* </View> */}
                </View>
            </Modal>
        ) 
    };
}