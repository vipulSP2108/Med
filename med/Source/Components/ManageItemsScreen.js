import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ManageItemsScreen = ({ selectedCategory, editingOutlet, setEditingOutlet }) => {
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [itemType, setItemType] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    // const [itemStutus, setItemStutus] = useState(true);

    const addItem = () => {
        const newItem = {
            id: Date.now().toString(),
            item: itemName,
            price: itemPrice,
            description: itemDescription,
            type: itemType,
            stutus: true,
        };

        const updatedMenu = editingOutlet.menu.map((menuCategory) => {
            if (menuCategory.id === selectedCategory.id) {
                return {
                    ...menuCategory,
                    items: [...menuCategory.items, newItem],
                };
            }
            return menuCategory;
        });

        setEditingOutlet({ ...editingOutlet, menu: updatedMenu });
        setItemName('');
        setItemPrice('');
        setItemDescription('');
        // setItemStutus(true);
        // setItemType('')
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Manage Items in {selectedCategory.title}</Text>
            <FlatList
                data={selectedCategory.items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.item}>{item.item}</Text>
                        <Text style={styles.item}>{item.price}</Text>
                        {/* <Text style={styles.item}>{item.description}</Text> */}
                        <Text style={styles.item}>{item.description}</Text>
                        <Text style={styles.item}>{item.stutus}</Text>
                    </View>
                )}
            />
            <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Item name"
            />
            <TextInput
                style={styles.input}
                value={itemPrice}
                onChangeText={setItemPrice}
                placeholder="Item price"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                value={itemDescription}
                onChangeText={setItemDescription}
                placeholder="Item description"
            />
            <TextInput
                style={styles.input}
                value={itemType}
                onChangeText={setItemType}
                placeholder="Item Type"
            />
            {/* <TextInput
                style={styles.input}
                value={itemStutus}
                onChangeText={setItemStutus}
                placeholder="Item Status"
            /> */}
            <Button title="Add Item" onPress={addItem} />
        </View>
    );
};

const styles = StyleSheet.create({
    
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});

export default ManageItemsScreen;
