// GlobalStateContext.js
import React, { createContext, useState, useEffect } from 'react';
export const GlobalStateContext = createContext();
// import { mockCampusShops } from "../Data/mockCampusShops";
import { mockCampusMenu } from "../Data/mockCampusMenu";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALLOUTLETS2_ENDPOINT, ALLOUTLETS_ENDPOINT, API_BASE_URL, USEROUTLETS_ENDPOINT, USERSDATA_ENDPOINT } from '../Constants/Constants';
import { Alert, Appearance } from 'react-native';
import { useFonts } from 'expo-font';
import { use } from 'react';
import { fetchMessMenuData, fetchSpecialData, getMessByEmail } from '../ScreensMessServices/helper/fetchMessMenuData';

// const filterRecentHistory = (history) => {
//   const currentDate = new Date();
//   const sixtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 3));

//   return history.filter(entry => new Date(entry.Noformatdate) >= sixtyDaysAgo);
// };


export const GlobalStateProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();

  const [messFullHistory, setMessFullHistory] = useState([]);
  const [messTodayHistory, setMessTodayHistory] = useState([]);

  
  const [specialMessData, setSpecialMessData] = useState();
  const [messMealData, setMessMealData] = useState();
  const [cartItemsNEW, setCartItemsNEW] = useState([]);
  const [userRole, setUserRole] = useState('Buyer');
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [vegMode, setVegMode] = useState(false);
  const [popularMenu, setPopularMenu] = useState();
  const [CartItems, setCartItems] = useState([]);
  const [campusShops, setcampusShops] = useState([]);
  const [campusMenu, setcampusMenu] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [updatedCartWithDetails, setUpdatedCartWithDetails] = useState([]);
  const [dateGroup, setDateGroup] = useState([]);
  const [History, setHistory] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [outletsNEW, setOutletsNEW] = useState([]);
  const [userData, setUserData] = useState([]);

  const [orderLength, setOrderLength] = useState(0);

  const [doctorData, setDoctorData] = useState([]);

    const [userMess, setUserMess] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log('err [Token not found in GlobalState]');
        return (
          <Error
            heading="Network Error"
            content={`We’re sorry for the inconvenience. It looks like your session has expired due to inactivity or other reasons. Our team is constantly working to improve your experience.
            \n Please log out and log back in to refresh your session. Thank you for your understanding and patience!`}
          />
        );
      }
      // http://192.168.1.3:5001/userdata
      const response = await fetch(`${API_BASE_URL}:${USERSDATA_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      });

      if (!response.ok) {
        throw new Error('Network response /userdata in GlobalState was not ok ' + response.statusText);
      }

      const data = await response.json();
      console.log("/userdata in GlobalState", data.data)
      setUserData(data.data)
    } catch (error) {
      console.error('Error fetching /userdata in GlobalState:', error);
    }
  };


  const [fontFamilies, setFontFamilies] = useState({});

  const [fontsLoaded] = useFonts({
    'Zain_Black': require('./../../assets/fonts/Zain/Zain-Black.ttf'),
    'Zain_ExtraBold': require('./../../assets/fonts/Zain/Zain-ExtraBold.ttf'),
    'Zain_Bold': require('./../../assets/fonts/Zain/Zain-Bold.ttf'),
    'Zain_Light': require('./../../assets/fonts/Zain/Zain-Light.ttf'),
    'Zain_ExtraLight': require('./../../assets/fonts/Zain/Zain-ExtraLight.ttf'),
    'Zain_Regular': require('./../../assets/fonts/Zain/Zain-Regular.ttf'),

    'Nunito_Black': require('./../../assets/fonts/Montserrat/static/Montserrat-Black.ttf'),
    'Nunito_ExtraBold': require('./../../assets/fonts/Montserrat/static/Montserrat-ExtraBold.ttf'),
    'Nunito_Bold': require('./../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
    'Nunito_Light': require('./../../assets/fonts/Montserrat/static/Montserrat-Light.ttf'),
    'Nunito_ExtraLight': require('./../../assets/fonts/Montserrat/static/Montserrat-ExtraLight.ttf'),
    'Nunito_Medium': require('./../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setFontFamilies({
        Zain_black: 'Zain_Black',
        Zain_extrabold: 'Zain_ExtraBold',
        Zain_bold: 'Zain_Bold',
        Zain_regular: 'Zain_Regular',
        Zain_light: 'Zain_Light',
        Zain_extralight: 'Zain_ExtraLight',

        Nunito_black: 'Nunito_Black',
        Nunito_extrabold: 'Nunito_ExtraBold',
        Nunito_bold: 'Nunito_Bold',
        Nunito_medium: 'Nunito_Medium',
        Nunito_light: 'Nunito_Light',
        Nunito_extralight: 'Nunito_ExtraLight',
      });
    }
  }, [fontsLoaded]);

  // ------------------------ getUserRole && getVegData ----------------------------------------//
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const storedUserRole = await AsyncStorage.getItem('userRole');
        if (storedUserRole !== null) setUserRole(JSON.parse(storedUserRole));
      } catch (error) {
        console.error('Error fetching storedUserRole:', error);
      }
    };
    getUserRole();

    const getVegData = async () => {
      try {
        const storedVegMode = await AsyncStorage.getItem('vegMode');
        console.log('storedVegMode:', storedVegMode);
        if (storedVegMode !== null) setVegMode(JSON.parse(storedVegMode));
      } catch (error) {
        console.error('Error fetching storedVegMode:', error);
      }
    };
    getVegData();

    const getDarkData = async () => {
      try {
        const storedDarkMode = await AsyncStorage.getItem('darkMode');
        if (storedDarkMode !== null) setDarkMode(JSON.parse(storedDarkMode));
      } catch (error) {
        console.error('Error fetching storedDarkMode:', error);
      }
    };
    getDarkData();
  }, [vegMode, darkMode]);

  // useEffect(() => {
  //   console.log('Current vegMode:', vegMode);
  // }, [vegMode]);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}:${ALLOUTLETS_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          Alert.alert("Network response was not ok");
          // throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (outletsNEW !== data.data) {
          // setOutletsNEW(data.data);
          setOutletsNEW(vegMode ? data.data.filter(shop => shop.type == "PureVeg") : data.data);
          // setOutletsNEW(vegMode ? outletsNEW.filter(shop => shop.type == "PureVeg") : outletsNEW);
          // setcampusMenu(vegMode ? mockCampusMenu.filter(shop => shop.type === "PureVeg") : mockCampusMenu);
          // setOutletsNEW(outletsNEW);
          setcampusMenu(mockCampusMenu);
        }
        // setLoading(false);
      } catch (error) {
        console.error("Error saving menu:", error);
        // setLoading(false);
      }
    };
    fetchOutlets();
  }, [vegMode]);

  useEffect(() => {
    getUserOutlets();
  }, []);


  useEffect(() => {
    fetchSpecialData(setSpecialMessData);
    fetchMessMenuData(setMessMealData); // Fetch data when component mounts
  }, []);

  useEffect(() => {
    getMessByEmail(userData.contactinfo, setUserMess); // Fetch data when component mounts
  }, [userData]);
  
  // useEffect(() => {
  //   setOutletsNEW(vegMode ? outletsNEW.filter(shop => shop.type == "PureVeg") : outletsNEW);
  //   setcampusMenu(vegMode ? mockCampusMenu.filter(shop => shop.type === "PureVeg") : mockCampusMenu);
  // }, [vegMode]);

  const getUserOutlets2 = async (vegMode) => {
    try {
      const response = await fetch(`${API_BASE_URL}:${ALLOUTLETS2_ENDPOINT}`);

      if (!response.ok) {
        console.log('Network response was not ok');
        Alert.alert("Network response was not ok");
        return;
      }

      const data = await response.json();
      if (outletsNEW !== data.data) {
        setOutletsNEW(vegMode ? data.data.filter(shop => shop.type == "PureVeg") : data.data);
      }
    } catch (error) {
      console.error('Error fetching user outlets:', error);
      Alert.alert("Error fetching user outlets");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getUserOutlets2(vegMode);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [vegMode]);

  const getUserOutlets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        return console.log('err [Token not found]');
      }

      const response = await fetch(`${API_BASE_URL}:${USEROUTLETS_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();
      setOutlets(data.data);
    } catch (error) {
      console.error('Error fetching user outlets:', error);
    }
  };
  // console.log(outlets)

  // useEffect(() => {
  //   const groupOrdersByDate = (orders) => {
  //     console.log(orders)
  //     const groupedOrders = orders.reduce((acc, order) => {
  //       const { date, totalPrice, Noformatdate } = order;
  //       if (!acc[date]) {
  //         acc[date] = { total: 0, orders: [], Noformatdate: '' };
  //       }
  //       acc[date].total += totalPrice;
  //       acc[date].orders.push(order);
  //       acc[date].Noformatdate = Noformatdate;
  //       return acc;
  //     }, {});
  //     return groupedOrders;
  //   }

  //   const groupedOrders = groupOrdersByDate(History);

  //   const DateGroup = Object.keys(groupedOrders).map(date => ({
  //     date,
  //     total: groupedOrders[date].total,
  //     orders: groupedOrders[date].orders,
  //     Noformatdate: groupedOrders[date].Noformatdate
  //   }));

  //   setDateGroup(DateGroup);

  // }, [History]);

  // useEffect(() => {
  //   const updatedCart = Object.entries(CartItems)
  //     .map(([storeName, items]) => {
  //       const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  //       const store = mockCampusShops.find(shop => shop.name === storeName);
  //       if (store) {
  //         const { menu, ...storeDetails } = store; // Exclude the menu
  //         return {
  //           storeName,
  //           storeDetails,
  //           items,
  //           totalPrice
  //         };
  //       }
  //       return {
  //         storeName,
  //         storeDetails: null,
  //         items,
  //         totalPrice
  //       };
  //     })
  //     .filter(cart => cart.items.length > 0 && cart.totalPrice > 0); // Filter out stores with no items or total price 0
  //   setUpdatedCartWithDetails(updatedCart);
  // }, [CartItems]);

  const updateQuantity = (id, newQuantity) => {
    setQuantity(prevQuantity => ({
      ...prevQuantity,
      [id]: newQuantity
    }));
  };


  const saveHistory = async (history) => {
    try {
      const jsonValue = JSON.stringify(history);
      await AsyncStorage.setItem('@history', jsonValue);
      console.log('History saved');
    } catch (e) {
      console.error("Error saving history:", e);
    }
  };

  const loadHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@history');
      if (jsonValue !== null) {
        console.log('History loaded');
        setHistory(JSON.parse(jsonValue));
      } else {
        console.log('No history found');
        setHistory([]);
      }
    } catch (e) {
      console.error("Error loading history:", e);
      setHistory([]);
    }
  };

  const saveCart = async (cart) => {
    try {
      const jsonValue = JSON.stringify(cart);
      await AsyncStorage.setItem('Carts', jsonValue);
      console.log('Carts saved');
    } catch (e) {
      console.error("Error saving Carts:", e);
    }
  };

  const loadCart = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Carts');
      if (jsonValue !== null) {
        console.log('Carts loaded');
        setCartItemsNEW(JSON.parse(jsonValue));
      } else {
        console.log('No Carts found');
        setCartItemsNEW([]);
      }
    } catch (e) {
      console.error("Error loading Carts:", e);
      setCartItemsNEW([]);
    }
  };

  useEffect(() => {
    (async () => {
      await loadCart();
      // await loadHistory();
    })();
  }, []); // This loads the history and cart when the component mounts

  useEffect(() => {
    (async () => {
      await loadHistory();
      // await loadCart();
    })();
  }, []); // This loads the history and cart when the component mounts

  useEffect(() => {
    saveHistory(History);
    // if (cartItemsNEW.length > 0) {
    // saveCart(cartItemsNEW);
    // }
  }, [History]); // Saves when History or cartItemsNEW change

  useEffect(() => {
    // if (cartItemsNEW.length > 0) {
    saveCart(cartItemsNEW);
    // }
  }, [cartItemsNEW]);

  // const fetchFeatures = async () => {
  // setcampusShops(mockCampusShops)
  // setcampusMenu(mockCampusMenu)
  // try {
  //   const response = await fetch('https://fdbb94ad-4fe0-4083-8c28-aaf22b8d5dad.mock.pstmn.io/mockcampus/home/popular');
  //   if (!response.ok) {
  //     console.log('Network response was not ok');
  //   }
  //   const data = await response.json();
  //   console.log(data)
  //   setFeatures(data);
  //   if (!data) {
  //     console.log('Failed to parse response as JSON');
  //   }
  // } catch (error) {
  //   console.error("Error loading features:", error);
  // }
  // };


  let segregatedData = {};
  const [segregatedDataList, setSegregatedDataList] = useState()
  function segregateData(outlets) {
    segregatedData = {}; // Reset segregatedData

    outlets.forEach(store => {
      store.menu.forEach(menu => {
        menu.items.forEach(item => {
          const itemKey = item.item;
          if (!segregatedData[itemKey]) {
            segregatedData[itemKey] = {
              name: itemKey,
              image: item.image,
              availability: [],
              rating: item.rating,
              ratingcount: item.ratingcount,
              menutype: menu.title,
              type: item.type,
              featured: store.featured
            };
          }
          const availabilityDetails = {
            location: store.location,
            menutype: menu.title,
            type: item.type,
            name: store.name,
            price: item.price,
            upiId: store.upiId,
            shopkeepername: store.shopkeeperName,
            image: store.image,
            rating: item.rating,
            ratingcount: item.ratingcount
          };
          segregatedData[itemKey].availability.push(availabilityDetails);
        });
      });
    });
    setSegregatedDataList(Object.values(segregatedData));
  }

  useEffect(() => {
    segregateData(outletsNEW);
  }, [outletsNEW]);

  return (
    <GlobalStateContext.Provider value={{ specialMessData, setSpecialMessData, userMess, setUserMess, doctorData, setDoctorData, messMealData, setMessMealData, popularMenu, setPopularMenu, segregatedDataList, setSegregatedDataList, orderLength, setOrderLength, fontsLoaded, fontFamilies, userData, setUserData, cartItemsNEW, setCartItemsNEW, outletsNEW, setOutletsNEW, outlets, userRole, setUserRole, dateGroup, History, setHistory, campusShops, setcampusShops, quantity, setQuantity, campusMenu, setcampusMenu, CartItems, setCartItems, updateQuantity, updatedCartWithDetails, setUpdatedCartWithDetails, vegMode, setVegMode, setDarkMode, darkMode }}>
      {children}
    </GlobalStateContext.Provider>
  );
};