import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, USEROUTLETS_ENDPOINT } from '../Constants/Constants';

const getUserOutlets = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            throw new Error('Token not found');
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
        return data.data;
    } catch (error) {
        console.error('Error fetching user outlets:', error);
        return null; // or throw error if you want to handle it in the calling function
    }
};

export { getUserOutlets }; 