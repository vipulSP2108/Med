// RenderDetails.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';

export default function RenderDetails({ flatListRef, data, viewabilityConfig }) {
    const renderDetails = ({ item }) => (
        <View style={{ backgroundColor: 'fuchsia' }}>
            <Text>{item.price}</Text>
        </View>
    );

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={data.name}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderDetails}
                snapToStart
                keyExtractor={(item, index) => index.toString()}
                decelerationRate='fast' // Adjust the snapping speed
                pagingEnabled
                viewabilityConfig={viewabilityConfig}
            />
        </View>
    );
}
