// Delete

import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';
import Colors from './Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Icons from './Icons';
import FoodIcon from './FoodIcon';
import CoffeeCard from './CoffeeCart';
import { ListCard_O, ListCard_S, ListCard_Z } from './ListCards';
import { ThemeContext } from '../Context/ThemeContext';

const Content = ({ data }) => {
    const navigation = useNavigation();
    const { themeColors, toggleTheme } = useContext(ThemeContext);

    const navToDetails = (item) => {
        navigation.navigate("Details", { Data: item });
    };

    return (
        //    <View style={styles.renderItem2container}>
        //         <View>
        //             <FlatList
        //                 data={data}
        //                 numColumns={2}
        //                 showsVerticalScrollIndicator={false}
        //                 contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
        //                 columnWrapperStyle={{
        //                     justifyContent: 'space-around'
        //                 }}
        //                 renderItem={({ item }) => <ListCard_S item={item} />}
        //                 keyExtractor={(item, index) => index.toString()}
        //                 showsHorizontalScrollIndicator={false}
        //             />
        //         </View>
        //     </View>

        < FlatList
            data={data}
            renderItem={({ item }) => <ListCard_O themeColors={themeColors} item={item} />} // ListCard_O && ListCard_Z
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    renderItem2container: {
        // flex: 1,
        paddingHorizontal: 6,
        // paddingTop: 16,
    },
});

export default Content;