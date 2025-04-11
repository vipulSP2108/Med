import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView, Keyboard, Dimensions, Image, KeyboardAvoidingView } from 'react-native';
import Colors from '../Components/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADDMENU_ENDPOINT, API_BASE_URL } from '../Constants/Constants';
import { getUserOutlets } from '../Components/fetchYourOutlet';
import Details_Seller from '../Components/Details_Seller';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TextStyles from '../Style/TextStyles';
import TruncatedTextComponent from '../Components/TruncatedTextComponent';
import { StatusBar } from 'react-native';
import ToastNotification from '../Components/ToastNotification';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import useCustomAlert from '../Components/Alerthook';
import { ThemeContext } from '../Context/ThemeContext';

const menuTypes = ['Beverage', 'Dessert', 'General', 'Coffee', 'Printing', 'Indian', 'Grocery', 'Healthy Food', 'Fast Food', 'Stationery', 'Cuisine', 'Laundry Services', 'Bakery'];

const ManageCategoriesScreen = ({ navigation }) => {
  const [editingMenu, setEditingMenu] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newItem, setNewItem] = useState({
    id: null,
    item: '',
    price: '',
    type: '',
    description: '',
    status: true,
    category: '',
    image: '',
    rating: '',
    ratingcount: '',
    featured: false,
  });

  const { themeColors, toggleTheme } = useContext(ThemeContext);
  const { showAlert, AlertWrapper } = useCustomAlert();

  const fetchOutlets = async () => {
    const outlets = await getUserOutlets();
    setEditingMenu(outlets[0].menu);
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  const [showToast, setShowToast] = useState(false);

  const handleSaveMenu = async () => {
    if (!editingMenu) {
      showAlert({
        title: "Uh-oh, Missing Information!",
        message: "All fields must be completed before continuing.",
        codeMassage: { code: '400', text: '⚠️ Fill in the blanks and try again!' },
      });
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      // console.log(editingMenu)
      // const updatedMenuType = { ...prevState, category: category.join('_') };

      const dataToSend = { menu: editingMenu, token };
      console.log('Sending data'); //dataToSend

      const response = await fetch(`${API_BASE_URL}:${ADDMENU_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      if (data.status === "ok") {
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 2500); // 300ms slide in + 3000ms delay + 300ms slide out
      } else {
        showAlert({
          title: "Oops, Server Error!",
          message: "Something went wrong on our end. Please try again later.",
          codeMassage: { code: '500', text: '🔥 Server’s on a break! We’ll be back soon.' },
        });
      }
    } catch (error) {
      console.error("Error saving menu:", error);
    }
  };

  const addCategory = () => {
    const categoryExists = editingMenu.find(menuCategory => menuCategory.title === newCategoryTitle);

    if (newCategoryTitle == '') {
      showAlert({
        title: "Choose a Category!",
        message: "Please select a category before continuing.",
        codeMassage: { code: '400', text: '📋 Pick a category and move ahead!' },
      });
    }
    else if (!categoryExists) {
      const newCategory = {
        id: Date.now().toString(),
        title: newCategoryTitle,
        items: []
      };
      setEditingMenu([...editingMenu, newCategory]);
      setNewCategoryTitle('');
    } else {
      showAlert({
        title: "Category Already Exists!",
        message: "This category is already here. Try another one.",
        codeMassage: { code: '400', text: '⚠️ This category is taken. Pick something new!' },
      });
    }
  };

  const editCategory = (id, newTitle) => {
    // Create a new array where only the item with the matching _id is modified.
    const updatedMenu = editingMenu.map(menuCategory => {
      if (menuCategory.id === id) {
        return { ...menuCategory, title: newTitle };  // Update the title for the matching category
      }
      return menuCategory; // Keep the other items unchanged
    });

    // Set the new state with the updated menu array
    setEditingMenu(updatedMenu);
  };

  const handleChange = (field, value) => {
    setNewItem({ ...newItem, [field]: value })
    // setEditingOutlet({ ...editingOutlet, [field]: value });
  };

  const addItem = () => {
    if (!selectedCategory) {
      showAlert({
        title: "Please Choose a Category!",
        message: "You need to select a category to proceed.",
        codeMassage: { code: '400', text: '📚 Choose a category to move forward!' },
      });
      return;
    }
    let missingFields = [];

    if (!newItem.item) missingFields.push("Item Name");
    if (!newItem.type) missingFields.push("Item Type");
    if (!newItem.price) missingFields.push("Price");
    if (!newItem.description) missingFields.push("Description");
    if (!newItem.category) missingFields.push("Category");

    if (missingFields.length > 0) {
      showAlert({
        title: "Missing Information",
        message: `Please fill in the following fields:\n${missingFields.join(", ")}`,
        codeMassage: { code: '201', text: '😅 Oops! Looks like something’s missing!' },
      });
      return;
    }

    const newItemObj = {
      id: newItem.id ? newItem.id : Date.now().toString(),
      item: newItem.item,
      price: newItem.price,
      type: newItem.type,
      description: newItem.description,
      status: newItem.status,
      // category: newItem.category.join('_'),
      category: newItem.category,
      image: newItem.image,
      rating: newItem.rating || 3,
      ratingcount: newItem.ratingcount || 7,
      featured: newItem.featured,
    };

    // console.log('category', newItemObj.category)

    const updatedMenu = editingMenu.map(menuCategory => {
      if (menuCategory.title === selectedCategory.title) {

        const existingItemIndex = menuCategory.items.findIndex(item => item.id == newItemObj.id);
        // console.log(existingItemIndex, newItemObj)
        if (existingItemIndex == -1) {
          // Add new item
          menuCategory.items.push({
            ...newItemObj,
            rating: 3,
            ratingcount: 7
          });

        } else {
          // Update existing item
          menuCategory.items[existingItemIndex] = newItemObj;
        }
      }
      return menuCategory;
    });

    setEditingMenu(updatedMenu);
    setNewItem({ id: null, item: '', price: '', type: '', description: '', rating: '', ratingcount: '' });
  };

  const editItem = (item) => {
    setNewItem(item);
  };

  const handleDeleteItem = (itemId) => {
    // Find the category of the selected category
    const updatedMenu = editingMenu.map(menuCategory => {
      if (menuCategory.title === selectedCategory?.title) {
        // Filter out the item with the given itemId from the items array
        menuCategory.items = menuCategory.items.filter(item => item.id !== itemId);
      }
      return menuCategory;
    });

    setEditingMenu(updatedMenu);
  };

  const scrollViewRef = useRef(null);

  const handleDropdownPress = () => {
    toggleDropdown();
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 1200, animated: true });
      }
    }, 10); // Adjust the timeout as needed
  };

  const handleCatigoryDropdownPress = () => {
    toggleCatigoryDropdown();
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 1200, animated: true });
      }
    }, 10); // Adjust the timeout as needed
  };

  const [openCatigoryDropdown, setOpenCatigoryDropdown] = useState(false);

  const toggleCatigoryDropdown = () => {
    setOpenCatigoryDropdown(prevState => !prevState);
  };

  // const handleMenuTypeToggle = (item) => {
  //   setSelectedCategory(item)
  // };
  // console.log(editingMenu)

  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdown(prevState => !prevState);
  };

  const handleMenuTypeToggle = (item) => {
    setSelectedCategory(item)
  };

  const handleDeleteCategory = (categoryId) => {
    const updatedMenu = editingMenu.filter(item => item !== categoryId);
    setEditingMenu(updatedMenu);
    if (selectedCategory == categoryId) {
      setSelectedCategory(null)
    }
  };

  const handleCatigoryMenuTypeToggle = (type) => {
    setNewItem(prevState => {
      const updatedMenuType = prevState.category.includes(type)
        ? prevState.category.filter(item => item !== type)
        : [...prevState.category, type];
      return { ...prevState, category: updatedMenuType };
    });
  };

  const fontstyles = TextStyles();
  return (
    <KeyboardAvoidingView>
      <ScrollView
        // ref={scrollViewRef}
        className='px-3 h-full w-full'
        style={{ backgroundColor: themeColors.backGroundColor }}
        keyboardShouldPersistTaps='handled'
      >
        <StatusBar backgroundColor={themeColors.backGroundColor} />

        <View className='mt-3 rounded-xl overflow-hidden'>
          <View className='rounded-xl p-3 ' style={{ backgroundColor: themeColors.componentColor }}>
            <View className='items-center flex-row mb-3'>
              <View className='absolute -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
              <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}>Manage Categories</Text>
            </View>
            <View className='my-1'>

              <TouchableOpacity
                className='p-3 font-black flex-row items-center justify-between text-base rounded-md'
                style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                onPress={() => {
                  Keyboard.dismiss();
                  handleDropdownPress();
                }}
              >
                <Text
                  className='flex-row justify-between rounded-md'
                  style={[fontstyles.h3, { marginTop: -2, color: themeColors.mainTextColor }]}
                >
                  {/* {selectedCategory} */}
                  {selectedCategory?.title ? selectedCategory.title : 'Select Item Categories'}
                </Text>
                <Ionicons
                  name={openDropdown ? "close" : "chevron-down"}
                  size={20}
                  color={themeColors.mainTextColor}
                />
              </TouchableOpacity>

              {openDropdown && (
                <View className='overflow-hidden font-black mt-2 text-base rounded-md' style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}>
                  {editingMenu.map((item, index) => (
                    <>
                      {/* {console.log(item.id)} */}
                      <View key={`${item.id}-${index}`} style={{ padding: 5 }} className='flex-row justify-between'>
                        <View className='flex-row gap-[1px] ml-1 items-center'>
                          <Ionicons color={themeColors.textColor} name="pencil" size={20} />
                          <TextInput
                            className='font-black overflow-hidden flex-row justify-between text-base rounded-md'
                            style={{ color: selectedCategory?.title === item.title ? themeColors.mainTextColor : themeColors.mainTextColor }}
                            value={item.title}
                            onChangeText={(text) => editCategory(item.id, text)}
                            placeholder="Edit category title"
                          />
                        </View>
                        <View className='flex-row gap-2'>

                          <TouchableOpacity className=' justify-center items-center px-2 rounded-md'
                            style={{ backgroundColor: themeColors.diffrentColorGreen }}
                            onPress={() => {
                              handleMenuTypeToggle(item);
                              toggleDropdown()
                            }}
                          >
                            <Text style={[fontstyles.h4, { color: themeColors.backGroundColor }]}>Select</Text>
                          </TouchableOpacity>

                          <TouchableOpacity className=' bg-red-200 justify-center items-center px-2 rounded-md'
                            onPress={() => {
                              handleDeleteCategory(item);
                            }}
                          >
                            <Ionicons color={themeColors.diffrentColorRed} name="trash-bin" size={18} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  ))}
                  <TextInput
                    className='font-black m-3 overflow-hidden flex-row justify-between text-base rounded-md'
                    style={{ color: themeColors.mainTextColor }}
                    value={newCategoryTitle}
                    placeholderTextColor={themeColors.textColor}
                    onChangeText={setNewCategoryTitle}
                    placeholder="Add new category"
                  />

                  <TouchableOpacity
                    className='p-3 m-2 items-center rounded-md'
                    style={{ backgroundColor: themeColors.diffrentColorPerple }}
                    onPress={addCategory}
                  >
                    <Text style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Add Category</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                  className='p-2 mb-2 mx-2 items-center rounded-md'
                  style={{ backgroundColor: themeColors.diffrentColorPerple }}
                  onPress={toggleDropdown}
                >
                  <Text className=' font-black text-base' style={{ color: themeColors.mainTextColor }}>Save Category Changes</Text>
                </TouchableOpacity> */}
                </View>
              )}
            </View>


            {selectedCategory &&

              <View>
                <View className='items-center flex-row my-3'>
                  <View className='absolute -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}>Your Cusines in {selectedCategory?.title}</Text>
                </View>

                {/* <ScrollView contentContainerStyle={{ paddingBottom: 20 }}> */}
                {selectedCategory.items.map((item, index) => (

                  <View
                    key={`${item.id}-${index}`}  // Use item.id or any unique property as the key
                    className="rounded-xl p-2 mb-3 flex-row"
                    style={{ backgroundColor: themeColors.secComponentColor }}
                  >
                    <Image
                      source={item.image ?
                        { uri: item.image, method: 'POST', headers: { Pragma: 'no-cache' } } :
                        require('./../../assets/menu.jpg')}
                      defaultSource={require('./../../assets/menu.jpg')}
                      className="w-12 h-12 rounded-full mr-1"
                      alt="Logo"
                    />
                    <View>
                      <Text style={[fontstyles.h3, { color: themeColors.mainTextColor }]} numberOfLines={1} ellipsizeMode="tail">
                        {TruncatedTextComponent(item.item, 11)}
                      </Text>
                      <TouchableOpacity className="flex-row items-center">
                        <Text style={[fontstyles.h5, { color: themeColors.textColor }]}>
                          {item.category?.split('_').join(', ')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row gap-x-2 absolute right-2 top-2 h-full">
                      <TouchableOpacity
                        className="justify-center items-center rounded-lg px-3"
                        style={{ backgroundColor: themeColors.diffrentColorGreen }}
                        onPress={() => editItem(item)}
                      >
                        <Text style={[fontstyles.h5, { color: themeColors.backGroundColor }]}>
                          {item.type}
                        </Text>

                        <View className="flex-row items-center justify-center">
                          <Text style={[fontstyles.number, { color: themeColors.backGroundColor }]}>
                            Edit
                          </Text>
                          <Ionicons
                            style={{ transform: [{ rotate: '90deg' }], margin: -3 }}
                            name="remove-outline"
                            size={16}
                          />
                          <Text style={[fontstyles.number, { color: themeColors.backGroundColor }]}>
                            ₹{item.price}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="bg-red-200 justify-center items-center px-2 rounded-lg"
                        onPress={() => handleDeleteItem(item.id)} // Pass item.id to the handleDeleteItem function
                      >
                        <Ionicons color={themeColors.diffrentColorRed} name="trash-bin-outline" size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                {/* </ScrollView> */}
              </View>
            }
          </View>
        </View>

        {selectedCategory &&
          <View className='mt-3 rounded-xl overflow-hidden'>
            <View className='rounded-xl p-3 ' style={{ backgroundColor: themeColors.componentColor }}>
              <View className='items-center flex-row mt-1'>
                <View className='absolute -left-11 rounded-lg h-full w-10' style={{ backgroundColor: themeColors.diffrentColorOrange }} />
                <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}>Edit Cusines in {selectedCategory?.title}</Text>
              </View>

              <View className='mt-2 flex-row items-center justify-between'>
                <View className=' w-[47%]'>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Item Name</Text>
                  <TextInput
                    value={newItem.item}
                    style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                    placeholderTextColor={themeColors.textColor}
                    className='font-black p-2 text-base underline pl-2 my-2 text-left rounded-md'
                    onChangeText={(text) => setNewItem({ ...newItem, item: text })}
                    placeholder="Item name"
                  />
                </View>
                <View className=' w-[47%]'>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Item Price</Text>
                  <TextInput
                    value={newItem.price}
                    style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                    placeholderTextColor={themeColors.textColor}
                    className='font-black p-2 text-base underline pl-2 my-2 text-left rounded-md'
                    onChangeText={(text) => setNewItem({ ...newItem, price: text })}
                    placeholder="Item price"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View className='mt-1 w-full'>
                <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Item Description</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                  placeholderTextColor={themeColors.textColor}
                  className='font-black p-2 text-base underline pl-2 my-2 text-left rounded-md'
                  value={newItem.description}
                  onChangeText={(text) => setNewItem({ ...newItem, description: text })}
                  placeholder={`Describe your Product (e.g., specialties, ...)`}
                  multiline={true}
                />
              </View>
              <View className='mt-1 w-full'>
                {/* <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Item Image (optional)</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                  placeholderTextColor={themeColors.textColor}
                  className='font-black p-2 text-base underline pl-2 my-2 text-left rounded-md'
                  value={newItem.image}
                  onChangeText={(text) => setNewItem({ ...newItem, image: text })}
                  placeholder={`Enter Image URL (web link only, \n e.g., https://example.com/image.jpg)`}
                  multiline={true}
                /> */}
              </View>
              <View className='mt-1 w-full'>
                <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { color: themeColors.mainTextColor }]}>Item Category</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                  placeholderTextColor={themeColors.textColor}
                  className='font-black p-2 text-base underline pl-2 my-2 text-left rounded-md'
                  value={newItem.category}
                  onChangeText={(text) => setNewItem({ ...newItem, category: text })}
                  placeholder={`Item category`}
                  multiline={true}
                />
              </View>

              <View className='rounded-xl mt-3 w-full' style={{ backgroundColor: themeColors.componentColor }}>
                <View className='p-3 items-center flex-row justify-between'>
                  <View className='flex-row items-center'>
                    <Text style={[fontstyles.h3, { marginBottom: -4, color: themeColors.mainTextColor }]}>Featured</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleChange('featured', !newItem.featured)}>
                    <Ionicons
                      name='toggle'
                      size={38}
                      style={{ transform: [{ rotate: newItem.featured ? '0deg' : '180deg' }] }}
                      color={newItem.featured ? themeColors.diffrentColorGreen : themeColors.mainTextColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <TextInput
                style={styles.input}
                value={newItem.category}
                onChangeText={(text) => setNewItem({ ...newItem, category: text })}
                placeholder="Item category"
              /> */}
              {/* <View className='mt-1 w-full'>
              <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>Item Image</Text>

                <TouchableOpacity
                  className='p-3 my-2 font-black flex-row items-center justify-between text-base rounded-md'
                  style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}
                  onPress={() => {
                    Keyboard.dismiss();
                    handleCatigoryDropdownPress();
                  }}
                >
                  <Text
                    className='font-black flex-row justify-between text-base rounded-md'
                    style={{ color: themeColors.mainTextColor }}
                  >
                    {newItem.category?.length > 0 ? newItem.category.join(', ') : 'Select Menu Type'}
                  </Text>
                  <Ionicons
                    name={openCatigoryDropdown ? "close" : "chevron-down"}
                    size={20}
                    color={themeColors.mainTextColor}
                  />
                </TouchableOpacity>

                {openCatigoryDropdown && (
                  <View className='overflow-hidden font-black mt-2 text-base rounded-md' style={{ borderWidth: 1, borderColor: themeColors.mainTextColor, color: themeColors.mainTextColor }}>
                    {menuTypes.map((item) => (
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          overflow: 'hidden',
                          // backgroundColor: storeDetailsOffDays.offDays.includes(item) ? themeColors.backGroundColor : 'transparent',
                          // borderBottomWidth: 1,
                          // borderBottomColor: '#ccc',
                        }}

                        onPress={() => {
                          handleCatigoryMenuTypeToggle(item);
                          if (item === 'None') {
                            toggleDropdown(); // If not want to close on None
                          }
                        }}
                      >
                        <Text
                          className='font-black overflow-hidden flex-row justify-between text-base rounded-md'
                          style={{ color: newItem.category.includes(item) ? themeColors.mainTextColor : themeColors.textColor }}
                        >{item}
                        </Text>
                        {newItem.category.includes(item) && (
                          <Ionicons name="checkmark-outline" size={20} color={themeColors.diffrentColorGreen} />
                        )}
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      className='p-2 m-2 items-center rounded-md'
                      style={{ backgroundColor: themeColors.diffrentColorPerple }}
                      onPress={toggleCatigoryDropdown}
                    >
                      <Text className=' font-black text-base' style={{ color: themeColors.mainTextColor }}>Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View> */}

              {/* <Text numberOfLines={1} ellipsizeMode='tail' className='font-black text-base' style={{ color: themeColors.mainTextColor }}>Item Type</Text> */}
              <View className='my-3 rounded-xl'>
                <View className='rounded-xl ' style={{ backgroundColor: themeColors.componentColor }}>
                  <View className=' flex-row items-center justify-between'>
                    <View className=' flex-row justify-between'>
                      <TouchableOpacity
                        onPress={() => handleChange('type', 'PureVeg')}
                        style={{ backgroundColor: newItem.type === 'PureVeg' ? themeColors.diffrentColorGreen : themeColors.backGroundColor }}
                        className=' w-[35%] p-4 rounded-l-lg items-center'
                      >
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Pure Veg</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleChange('type', 'Veg')}
                        style={{ backgroundColor: newItem.type === 'Veg' ? themeColors.diffrentColorPerple : themeColors.backGroundColor }}
                        className=' w-[30%] p-4 items-center'
                      >
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Veg</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleChange('type', 'NonVeg')}
                        style={{ backgroundColor: newItem.type === 'NonVeg' ? themeColors.diffrentColorRed : themeColors.backGroundColor }}
                        className=' w-[35%] p-4 rounded-r-lg items-center'
                      >
                        <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>Non Veg</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              {/* <TextInput
    style={styles.input}
    value={newItem.type}
    onChangeText={(text) => setNewItem({ ...newItem, type: text })}
    placeholder="Item Type"
  /> */}

              <TouchableOpacity
                className='p-3 items-center rounded-md'
                style={{ backgroundColor: themeColors.diffrentColorPerple }}
                onPress={addItem}
              >
                <Text style={[fontstyles.h5, { marginTop: -2, color: themeColors.mainTextColor }]}>{newItem.id ? "Update Item" : "Add Item"}</Text>
              </TouchableOpacity>

              {/* <Button title= onPress={addItem} /> */}

            </View>
          </View>
        }

        {AlertWrapper()}
      </ScrollView>

      <View className='px-3' style={{ backgroundColor: themeColors.backGroundColor }}>
        <Animated.View entering={FadeInDown.delay(100).springify().damping(12)}>
          <TouchableOpacity onPress={handleSaveMenu}
            className=' w-full my-3 rounded-xl overflow-hidden' style={{ backgroundColor: themeColors.diffrentColorOrange }}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }} className='items-center justify-center p-3' >
              <Text numberOfLines={1} ellipsizeMode='tail' style={[fontstyles.blackh2, { paddingBottom: 4, color: themeColors.mainTextColor }]}>SAVE</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {/* <View className='mx-3'>
        <LinearGradient
          className=' absolute w-full bottom-0 h-10'
          colors={['transparent', themeColors.backGroundColor, themeColors.backGroundColor]}>
          <TouchableOpacity onPress={handleSaveMenu}
            className=' w-full absolute bottom-0 my-3 rounded-xl overflow-hidden' style={{ backgroundColor: themeColors.diffrentColorOrange }}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }} className='items-center justify-center p-3' >
              <Text numberOfLines={1} ellipsizeMode='tail' className=' font-black text-xl' style={{ color: themeColors.mainTextColor }}>SAVE</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

      </View> */}
      {/* ToastNotification */}
      {showToast && (
        <ToastNotification
          title="Success!"
          description="Menu saved successfully."
          showToast={showToast}
        />
      )}
    </KeyboardAvoidingView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   categoryContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   // category: {
//   //   fontSize: 18,
//   //   padding: 8,
//   //   backgroundColor: Colors.lightGray,
//   //   flex: 1,
//   // },
//   // input: {
//   //   borderWidth: 1,
//   //   borderColor: Colors.gray,
//   //   padding: 8,
//   //   marginBottom: 16,
//   //   flex: 1,
//   // },
//   // itemContainer: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'space-between',
//   //   padding: 8,
//   //   backgroundColor: Colors.lightGray,
//   //   marginBottom: 8,
//   // },
//   // item: {
//   //   fontSize: 16,
//   // },
//   // saveButton: {
//   //   marginTop: 16,
//   //   backgroundColor: Colors.primary,
//   //   padding: 16,
//   //   borderRadius: 8,
//   // },
//   // saveButtonContent: {
//   //   alignItems: 'center',
//   // },
//   // saveButtonText: {
//   //   color: 'white',
//   //   fontSize: 18,
//   // },
// });

export default ManageCategoriesScreen;
