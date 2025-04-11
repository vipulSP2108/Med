import { View, Text, FlatList, Dimensions } from 'react-native'
import React, { useRef, useState, useEffect, useContext } from 'react'
import SlideItems from './SlideItems'
import { StyledComponent } from 'nativewind'
import SlideItemsViwer from './SlideItemsViwer'
import Colors from './Colors'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../Context/ThemeContext'

export default function SlideContainor({ flatListRef, data, viewabilityConfig }) {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
      const { themeColors, toggleTheme } = useContext(ThemeContext);


    useEffect(() => {
        if (data.length === 0) return;  // Don't set up interval if data is empty

        const interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= data.length) {
                nextIndex = 0;
            }
            flatListRef?.current?.scrollToIndex({ animated: true, index: nextIndex });
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex, data.length]);  // Adding data.length as a dependency to handle changes

    const onViewablePopularFeatureChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <SlideItems item={item} navigation={navigation} />}
                snapToStart
                keyExtractor={(item, index) => index.toString()}
                decelerationRate="fast" // Adjust the snapping speed
                pagingEnabled
                onViewableItemsChanged={onViewablePopularFeatureChanged}
                viewabilityConfig={viewabilityConfig}
            />
            <View style={[styles.scrollViwerContainer, {backgroundColor: themeColors.secComponentColor,}]}>
                <SlideItemsViwer data={data} currentIndex={currentIndex} />
            </View>
        </View>
    );
}

const styles = {
    scrollViwerContainer: {
        marginHorizontal: Dimensions.get('window').width * 0.03, 
        gap: 3,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
         // bg color
        borderBottomRightRadius: 13,
        borderBottomLeftRadius: 13,
    }
}

// import { View, Text, FlatList, Dimensions } from 'react-native'
// import React, {useRef, useState, useEffect} from 'react'
// import SlideItems from './SlideItems'
// import { StyledComponent } from 'nativewind'
// import SlideItemsViwer from './SlideItemsViwer'
// import Colors from './Colors'
// import { useNavigation } from '@react-navigation/native'

// export default function SlideContainor({ flatListRef, data, viewabilityConfig }) {
//     const navigation = useNavigation();
//     const [currentIndex, setCurrentIndex] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             let nextIndex = currentIndex + 1;
//             if (nextIndex >= data.length) {
//                 nextIndex = 0;
//             }
//             flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
//         }, 3000);
//         return () => clearInterval(interval);
//     }, [currentIndex, data.length]);

//     const onViewablePopularFeatureChanged = useRef(({ viewableItems }) => {
//         if (viewableItems.length > 0) {
//           setCurrentIndex(viewableItems[0].index);
//         }
//       }).current;
      

//     return (
//         <View>
//             <FlatList
//                 ref={flatListRef}
//                 data={data}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 renderItem={({ item }) => <SlideItems item={item} navigation={navigation} />}
//                 snapToStart
//                 keyExtractor={(item, index) => index.toString()}
//                 // snapToInterval={(Dimensions.get('window').width * 0.9) + (Dimensions.get('window').width * 0.1)} // Width of item + margin
//                 decelerationRate='fast' // Adjust the snapping speed
//                 pagingEnabled
//                 onViewableItemsChanged={onViewablePopularFeatureChanged}
//                 viewabilityConfig={viewabilityConfig}
//             />
//             <View style={styles.scrollViwerContainer}>
//                 <SlideItemsViwer data={data} currentIndex={currentIndex} />
//             </View>
//        </View>


//     )
// }

// const styles = {
//     scrollViwerContainer: {
//         marginHorizontal: Dimensions.get('window').width * 0.03,  // should be applyed to all fixed items
//         // height: Dimensions.get('window').height * 0.02,
//         gap: 3,
//         flexWrap: 'wrap',
//         flexDirection: 'row',
//         justifyContent: 'center',
//         backgroundColor: themeColors.secComponentColor, // bg color
//         borderBottomRightRadius: 13,
//         borderBottomLeftRadius: 13,
//     }
// }