import React, { useContext, useState } from 'react';
import { Modal, Text, View, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Image } from 'react-native';
import TextStyles from '../Style/TextStyles';
import Colors from './Colors';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../Context/ThemeContext';

const AlertCustom = ({ title, visible, message, buttons, codeMassage, additional, onClose }) => {
  const { themeColors, toggleTheme } = useContext(ThemeContext);

  const fontstyles = TextStyles();
  const [openModel, setOpenModel] = useState(false);

  // Function to render buttons dynamically
  const renderButtons = () => {
    return buttons?.map((button, index) => (
      <TouchableOpacity
        key={index}
        className=' flex-row p-3 rounded-lg'
        style={[{ backgroundColor: button.styleColor || themeColors.diffrentColorRed }]}
        onPress={() => {
          button.onPress();
          onClose();
        }}
      >
        <Ionicons color={Colors.dark.colors.backGroundColor} activeOpacity={1} name={button.icon || 'prism'} size={20} />
        <Text style={[fontstyles.number, { fontSize: 15, marginLeft: 6 }]}>{button.text}</Text>
      </TouchableOpacity>
    ));
  };

  // Render additional details if available
  const renderAdditionalDetails = () => {
    return additional && additional?.map((item, index) => (
      <View key={index} style={{ flexDirection: 'row', marginVertical: 2 }}>
        <View style={{ flex: 1 }}>
          <Text style={[fontstyles.h4, styles.buttonText]}>{item.head}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[fontstyles.h1, styles.buttonText]}>{item.head2}</Text>
        </View>
      </View>
    ));
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      {/* animationType="slide" */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View className=' p-2' style={{ width: '80%', borderRadius: 12, backgroundColor: Colors.dark.colors.subbackGroundColor }}>
              <View className=' flex-row items-center justify-between'>
                <Text style={[fontstyles.h1, { fontSize: 16, marginTop: -4, color: Colors.dark.colors.textColor }]}>
                  {codeMassage?.text}
                </Text>
                <View className=' flex-row items-center'>
                  <Text className='' style={[fontstyles.h3, { fontSize: 16, marginTop: -4, color: Colors.dark.colors.secComponentColor }]}>
                    {codeMassage?.code}
                  </Text>
                  <TouchableOpacity onPress={() => setOpenModel(!openModel)}>
                    {/* // menu */}
                    <Ionicons color={Colors.dark.colors.secComponentColor} activeOpacity={1} name="chevron-down" size={16} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ alignItems: 'center', marginTop: 20 }}>
                {codeMassage?.imagePath &&
                  <Image
                    source={codeMassage?.imagePath}
                    className=' h-20 w-20 rounded-full mt-6'
                    alt="Logo"
                  />
                }
                <View style={{ alignItems: 'center', marginTop: 16 }}>
                  <Text style={[fontstyles.h3, { color: Colors.dark.colors.mainTextColor }]}>{title}</Text>
                  <Text className=' pt-4' style={[fontstyles.h5, { lineHeight: 19, textAlign: 'center', color: Colors.dark.colors.textColor }]}>{message}</Text>
                </View>
                <View className=' my-5' style={{ flexDirection: 'row', gap: 10 }}>
                  {renderButtons()}
                </View>
              </View>

              <View className=' px-4'>
                {openModel && renderAdditionalDetails()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(225, 0, 0, 0.1)',
  },
  buttonText: {
    color: Colors.dark.colors.textColor,
    fontSize: 19,
  },
});

export default AlertCustom;
