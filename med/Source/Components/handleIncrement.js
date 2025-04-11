import { useContext, useState, useCallback, useEffect } from "react";
import { GlobalStateContext } from "../Context/GlobalStateContext";
import { Audio } from "expo-av";

const useIncrementHandler = () => {
    const { cartItemsNEW, setCartItemsNEW, CartItems, setCartItems, updatedCartWithDetails } = useContext(GlobalStateContext);
    // const [menuItems, setMenuItems] = useState(menu);
    // const [cartItemsNEW, setCartItemsNEW] = useState([]);
    const [sound, setSound] = useState();

    async function playSound() {
        // console.log('Loading Sound');
    /* @info */ const { sound } = await Audio.Sound.createAsync(
      /* @end */ require('../assets/sounds/woz.mp3')
        );
        setSound(sound);

        // console.log('Playing Sound');
        await sound.setVolumeAsync(0.037)
        await /* @info */ sound.playAsync(); /* @end */
    }

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
          /* @info Always unload the Sound after using it to prevent memory leaks.*/ sound.unloadAsync(); /* @end */
            }
            : undefined;
    }, [sound]);

    const handleIncrement = useCallback((id, title, item, hotelData) => {
        setCartItemsNEW((prevCartItems) => {
            // Check if the hotel already exists in the cart
            const hotelIndex = prevCartItems.findIndex(
                (hotel) => hotel.id === hotelData.id
            );

            if (hotelIndex !== -1) {
                // Hotel exists, check if the item already exists in the hotel's orders
                const hotel = prevCartItems[hotelIndex];
                const itemIndex = hotel.orders.findIndex(
                    (order) => order.item === item.item
                );

                if (itemIndex !== -1) {
                    // Item exists, increment quantity
                    const updatedOrders = hotel.orders.map((order, index) =>
                        index === itemIndex
                            ? { ...order, quantity: order.quantity + 1 }
                            : order
                    );

                    const updatedHotel = { ...hotel, orders: updatedOrders };

                    return [
                        ...prevCartItems.slice(0, hotelIndex),
                        updatedHotel,
                        ...prevCartItems.slice(hotelIndex + 1),
                    ];
                } else {
                    // Item doesn't exist, add it
                    const updatedOrders = [
                        ...hotel.orders,
                        { ...item, quantity: 1 },
                    ];

                    const updatedHotel = { ...hotel, orders: updatedOrders };

                    return [
                        ...prevCartItems.slice(0, hotelIndex),
                        updatedHotel,
                        ...prevCartItems.slice(hotelIndex + 1),
                    ];
                }
            } else {
                // Hotel doesn't exist, add it with the item
                // add sound
                playSound();
                
                const { menu, ...hotelDetails } = hotelData; // Exclude menu from hotelData
                const newHotel = {
                    ...hotelDetails,
                    orders: [{ ...item, quantity: 1 }],
                };

                return [...prevCartItems, newHotel];
            }
        });
        // console.log('Updated Cart Items:', JSON.stringify(cartItemsNEW, null, 2));
    }, []);

    const handleDecrement = useCallback((id, title, item, hotelData) => {
        setCartItemsNEW((prevCartItems) => {
            // Check if the hotel already exists in the cart
            const hotelIndex = prevCartItems.findIndex(
                (hotel) => hotel.id === hotelData.id
            );

            if (hotelIndex !== -1) {
                // Hotel exists, check if the item already exists in the hotel's orders
                const hotel = prevCartItems[hotelIndex];
                const itemIndex = hotel.orders.findIndex(
                    (order) => order.item === item.item
                );

                if (itemIndex !== -1) {
                    // Item exists, decrement quantity
                    const updatedOrders = hotel.orders
                        .map((order, index) =>
                            index === itemIndex
                                ? { ...order, quantity: order.quantity - 1 }
                                : order
                        )
                        .filter(order => order.quantity > 0); // Remove items with quantity 0

                    if (updatedOrders.length > 0) {
                        // There are still items in the orders
                        const updatedHotel = { ...hotel, orders: updatedOrders };

                        return [
                            ...prevCartItems.slice(0, hotelIndex),
                            updatedHotel,
                            ...prevCartItems.slice(hotelIndex + 1),
                        ];
                    } else {
                        // No items left in the orders, remove the hotel
                        return [
                            ...prevCartItems.slice(0, hotelIndex),
                            ...prevCartItems.slice(hotelIndex + 1),
                        ];
                    }
                } else {
                    // Item doesn't exist, no change needed
                    return prevCartItems;
                }
            } else {
                // Hotel doesn't exist, no change needed
                return prevCartItems;
            }
        });
        console.log('Updated through handleIncrement');
    }, []);

    return {
        // menuItems,
        handleIncrement,
        handleDecrement
    };
};

export default useIncrementHandler;