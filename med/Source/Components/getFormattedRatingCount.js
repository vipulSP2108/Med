import React from 'react';
import { Text } from 'react-native';

// Function that returns the formatted text directly
const getFormattedRatingCount = (ratingCount) => {
    if (!ratingCount) return 'No ratings yet';

    //   if (ratingCount < 1000) {
    //     return `${ratingCount}+`;
    if (ratingCount < 10) {
        return `${ratingCount}+`; // Round to nearest 10
    }else if (ratingCount < 100) {
        return `${Math.floor(ratingCount / 10) * 10}+`; // Round to nearest 10
    } else if (ratingCount < 1000) {
        return `${Math.floor(ratingCount / 100) * 100}+`; // Round to nearest 10
    } else if (ratingCount >= 1000 && ratingCount < 10000) {
        return `${(ratingCount / 1000).toFixed(1)}k+`;
    } else if (ratingCount >= 10000 && ratingCount < 100000) {
        return `${Math.floor(ratingCount / 1000)}k+`;
    } else if (ratingCount >= 100000 && ratingCount < 1000000) {
        return `${(ratingCount / 1000000).toFixed(1)}M+`;
    } else {
        return `${Math.floor(ratingCount / 1000000)}M+`;
    }
};

export default getFormattedRatingCount;



// const getFormattedRatingCount = (ratingCount) => {
//     if (!ratingCount) return 'No ratings yet';
  
//     // Round to the nearest multiple of 10 for smaller numbers
//     if (ratingCount < 1000) {
//       return `${Math.floor(ratingCount / 10) * 10}+`; // Round to nearest 10
//     }
//     // Round to the nearest multiple of 1000 for larger numbers
//     else if (ratingCount >= 1000 && ratingCount < 10000) {
//       return `${Math.floor(ratingCount / 100) * 100}+`; // Round to nearest 100
//     } 
//     // Round to the nearest multiple of 1000 for even larger numbers
//     else if (ratingCount >= 10000 && ratingCount < 100000) {
//       return `${Math.floor(ratingCount / 1000) * 1000}+`; // Round to nearest 1000
//     } 
//     // Round to the nearest multiple of 10000 for very large numbers
//     else if (ratingCount >= 100000 && ratingCount < 1000000) {
//       return `${Math.floor(ratingCount / 10000) * 10000}+`; // Round to nearest 10000
//     } 
//     // For values greater than a million, round to nearest 100000
//     else {
//       return `${Math.floor(ratingCount / 100000) * 100000}+`; // Round to nearest 100000
//     }
//   };
  