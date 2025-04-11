import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from './Colors';
import { ThemeContext } from '../Context/ThemeContext';

export default SlideItemsViwer = ({ data, currentIndex }) => {
          const { themeColors, toggleTheme } = useContext(ThemeContext);
    
    return (
        <View style={styles.scrollViewerContainer}>
            {data.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.scrollViewerIdentifier,
                        {backgroundColor: currentIndex === index ? themeColors.mainTextColor: themeColors.componentColor}
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollViewerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // Add any other styling you need for the container
    },
    scrollViewerIdentifier: {
        height: 6,
        width: 6,
        borderRadius: 99,
        
        margin: 2, // Adjust spacing between indicators as needed
    },
});
