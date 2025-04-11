export const removeStoreFromCart = (storeName, setCartItemsNEW) => {
    setCartItemsNEW(prevCartItems => {
        return prevCartItems.filter(item => item.name !== storeName);
    });
};