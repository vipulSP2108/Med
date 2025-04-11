// npx expo start

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from "react-redux";
import { GlobalStateProvider } from "./Source/Context/GlobalStateContext";
import AppNavigator from './Source/Navigation/AppNavigator';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { ThemeProvider } from './Source/Context/ThemeContext';

export default function App() {
  // const { themeColors, toggleTheme } = useContext(ThemeContext);
  return (
    <GlobalStateProvider>
      {/* <ClerkProvider publishableKey="pk_test_Z2l2aW5nLWRvdmUtNDMuY2xlcmsuYWNjb3VudHMuZGV2JA"> */}
      {/* <Provider> */}
      {/* <SignedIn> */}
      {/* <AppNavigator /> */}
      {/* </SignedIn> */}
      {/* <SignedOut> */}
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
      {/* </SignedOut> */}
      {/* </Provider> */}
      {/* </ClerkProvider> */}
    </GlobalStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
