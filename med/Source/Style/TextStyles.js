// styles/TextStyles.js
import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GlobalStateContext } from '../Context/GlobalStateContext';
import { useFonts } from 'expo-font';

const TextStyles = () => {
  const { fontFamilies} = useContext(GlobalStateContext);

  if (!fontFamilies) {
    return null;
  }

  const fontSizes = {
    verysmall: 10, //
    small: 12, //
    regular: 14, //
    medium: 16, //
    xmedium: 18,
    large: 20, //
    xlarge: 22,
    xxlarge: 26,
    xxxlarge: 28, //
  };
  
  const fontWeights = {
    regular: '400',
    bold: '700',
  };

  return StyleSheet.create({ 
    entryUpper: { // EntryTop // Model title
      marginBottom: -1, fontFamily: fontFamilies.Zain_bold, textTransform: 'uppercase', fontSize: 24
    },
    h1: { // EntryBottom
      marginBottom: -8, fontFamily: fontFamilies.Zain_black, fontSize: 38
    },
    blackh2: { // UserName
      marginBottom: -10, fontFamily: fontFamilies.Zain_black, fontSize: 26,
    },
    boldh2: { // ListCard Hotel Name
      fontFamily: fontFamilies.Zain_extrabold, fontSize: 26,
    },
    h3: { // cart storename // profile screen // Int cart
      marginBottom: -8, fontFamily: fontFamilies.Zain_bold, fontSize: 24,
    },
    h4: { // UserRole // Int cart
      fontFamily: fontFamilies.Zain_regular, fontSize: 22, 
    },
    numberbigger: { // All Number and adress
      fontFamily: fontFamilies.Nunito_bold, fontSize: 14, 
    },
    number: { // All Number and adress
      fontFamily: fontFamilies.Nunito_bold, fontSize: 12, 
    },
    h5: { // ListCard Hotel Catigory // view full menu // profile screen
      fontFamily: fontFamilies.Zain_regular, fontSize: 20, marginBottom: -6, 
    },
    h5_bold: {
      fontFamily: fontFamilies.Zain_extrabold, fontSize: 20, marginBottom: -6,
    },
    h5_5: { // ListCard Hotel Catigory // view full menu // profile screen
      fontFamily: fontFamilies.Zain_regular, fontSize: 18, marginBottom: -6, 
    },
    h6: { // ListCard Hotel Catigory // view full menu // profile screen
      fontFamily: fontFamilies.Zain_regular, fontSize: 16, marginBottom: -6,
    },

    h7: { // ListCard Hotel Catigory // view full menu // profile screen
      fontFamily: fontFamilies.Zain_regular, fontSize: 18, marginBottom: -6, 
    },
    
    // h5: {
    //   fontSize: fontSizes.regular,
    //   fontFamily: fontFamilies.bold,
    // },
    // h6: {
    //   fontSize: fontSizes.small,
    //   fontWeight: fontWeights.bold,
    // },
    // body: {
    //   fontSize: fontSizes.regular,
    //   fontWeight: fontWeights.regular,
    // },
    // bodySmall: {
    //   fontSize: fontSizes.small,
    //   fontWeight: fontWeights.regular,
    // },
    // caption: {
    //   fontSize: fontSizes.small,
    //   fontWeight: fontWeights.regular,
    // },
    // error: {
    //   fontSize: fontSizes.regular,
    //   fontWeight: fontWeights.regular,
    // },
    // link: {
    //   fontSize: fontSizes.regular,
    //   fontWeight: fontWeights.bold,
    // },
  });
};

export default TextStyles;
