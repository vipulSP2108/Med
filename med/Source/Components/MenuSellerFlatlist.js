import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from './Colors';
import { dropDown } from './dropDown';
import { ThemeContext } from '../Context/ThemeContext';

export default MenuSellerFlatlist = ({ newItem, sortItem, fontstyles, navigation, setOpenDropdowns, openDropdowns, handleChanges }) => {
    // Determine the filtered data based on the sortItem value
    const { themeColors, toggleTheme } = useContext(ThemeContext);
    const filteredData = (() => {
        if (sortItem === 'InStock') {
            return newItem?.map(category => ({
                ...category,
                items: category.items.filter(item => item.status === true),
            }));
        } else if (sortItem === 'SoldOut') {
            return newItem?.map(category => ({
                ...category,
                items: category.items.filter(item => item.status === false),
            }));
        } else {
            return newItem;
        }
    })();

    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }} // Optional padding at the bottom
            showsHorizontalScrollIndicator={false}
        >
            {filteredData?.map((category, categoryIndex) => (
                <View key={`${categoryIndex}`} style={{ marginBottom: 20 }}>
                    {category.items.map((item, index) => (
                        <View key={`${item.item}_${index}`}>
                            {/* Render each item using the dropDown function */}
                            {dropDown(themeColors, index, fontstyles, item, navigation, setOpenDropdowns, openDropdowns, handleChanges)}
                        </View>
                    ))}
                </View>
            ))}

            {/* Footer Section */}
            <View
                style={{
                    padding: 15,
                    backgroundColor: themeColors.backGroundColor,
                    height: Dimensions.get('window').height * 0.9,
                }}
            >
                <View style={{ gap: 10 }}>
                    <Text style={[fontstyles.boldh2, { color: themeColors.textColor }]}>
                        Disclaimer:
                    </Text>
                    <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                        Be mindful of portion sizes, especially when dining out, as restaurant portions are often larger than necessary.
                    </Text>
                    <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                        Not all fats are bad. Omega-3 fatty acids, found in fish, flaxseeds, and walnuts, are beneficial for heart health.
                    </Text>
                    <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                        The average adult needs about 8 cups (2 liters) of water per day, but individual needs may vary based on activity level, climate, and overall health.
                    </Text>
                    <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                        An average active adult requires 2,000 kcal of energy per day; however, calorie needs may vary.
                    </Text>
                </View>

                <View style={{ marginTop: 20 }}>
                    <View style={{ height: 1, backgroundColor: themeColors.textColor }} />
                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons color={'red'} name={'alert-circle-outline'} size={22} />
                            <Text style={[fontstyles.h4, { color: 'red' }]}> Report an issue with the menu</Text>
                        </View>
                        <Ionicons color={'red'} name={'caret-forward-outline'} size={22} />
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: themeColors.textColor, marginVertical: 1 }} />
                </View>

                <View>
                    <Image
                        source={require("./../Data/fssai.png")}
                        defaultSource={require('./../../assets/store.jpg')}
                        style={{ width: 56, height: 44 }}
                        alt="Logo"
                    />
                    <Text style={[fontstyles.number, { color: themeColors.textColor }]}>
                        Lic. No. 11521055001181
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};
