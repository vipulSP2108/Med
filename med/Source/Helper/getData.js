import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, USERSDATA_ENDPOINT } from "../Constants/Constants";

export const getData = async (setUserData) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token)
      const response = await fetch(`${API_BASE_URL}:${USERSDATA_ENDPOINT}`, {
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
      // console.log('data', data)
      setUserData(data.data)
      // console.log("userData", "home", data.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };